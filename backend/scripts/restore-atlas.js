/*
 * Restaura el respaldo (carpeta respaldo/<db>/) en una base destino.
 *
 * Uso:
 *   node scripts/restore-atlas.js "<uri_destino>" ["<db_destino>"] ["<carpeta_respaldo>"] [--force]
 * Defaults: db = bellezapro  |  carpeta = <proyecto>/respaldo
 *
 * Sin --force: aborta si alguna colección destino ya tiene documentos.
 * Con   --force: hace drop de cada colección destino antes de insertar.
 */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { EJSON } = require('bson');

const PROJ_ROOT = path.resolve(__dirname, '..', '..');
const DST_URI = process.argv[2];
const DB = process.argv[3] || 'bellezapro';
const SRC_DIR = process.argv[4] || path.join(PROJ_ROOT, 'respaldo');
const FORCE = process.argv.includes('--force');

if (!DST_URI) { console.error('Falta <uri_destino>'); process.exit(1); }

const dbDir = path.join(SRC_DIR, DB);
const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.json') && f !== '_manifest.json').sort();

(async () => {
  const client = new MongoClient(DST_URI, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db(DB);
  console.log(`Destino: ${db.databaseName} @ ${DST_URI.replace(/\/\/[^@]*@/, '//<redacted>@')}\n`);

  if (!FORCE) {
    const existing = await db.listCollections().toArray();
    const nonEmpty = [];
    for (const c of existing) {
      const n = await db.collection(c.name).countDocuments();
      if (n > 0) nonEmpty.push(`${c.name} (${n})`);
    }
    if (nonEmpty.length) {
      console.error('ABORTADO: la base destino ya tiene datos en: ' + nonEmpty.join(', '));
      console.error('Revisá el destino, o volvé a correr con --force para reemplazar.');
      await client.close();
      process.exit(2);
    }
  }

  let total = 0;
  for (const f of files) {
    const name = path.basename(f, '.json');
    const docs = EJSON.parse(fs.readFileSync(path.join(dbDir, f), 'utf8'));
    if (FORCE) { try { await db.collection(name).drop(); } catch (_) {} }
    if (docs.length) await db.collection(name).insertMany(docs, { ordered: false });
    const n = await db.collection(name).countDocuments();
    total += n;
    console.log(`  ${name.padEnd(24)} insertados ${String(docs.length).padStart(6)}  ->  destino ahora ${String(n).padStart(6)}`);
  }
  console.log(`\nColecciones: ${files.length}   Documentos en destino: ${total}`);
  await client.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
