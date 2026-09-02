/*
 * Respaldo completo de una base Mongo -> carpeta respaldo/ del proyecto.
 * Escribe un archivo EJSON por colección (preserva ObjectId, Date, etc.)
 * más un _manifest.json con conteos y timestamp.
 *
 * Uso:
 *   node scripts/dump-local.js ["<uri_origen>"] ["<db>"] ["<carpeta_destino>"]
 * Defaults: mongodb://localhost:27017  |  bellezapro  |  <proyecto>/respaldo
 */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { EJSON } = require('bson');

const PROJ_ROOT = path.resolve(__dirname, '..', '..');
const SRC_URI = process.argv[2] || 'mongodb://localhost:27017';
const DB = process.argv[3] || 'bellezapro';
const OUT_DIR = process.argv[4] || path.join(PROJ_ROOT, 'respaldo');

(async () => {
  const client = new MongoClient(SRC_URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(DB);
  const dbDir = path.join(OUT_DIR, DB);
  fs.mkdirSync(dbDir, { recursive: true });

  const cols = (await db.listCollections().toArray())
    .filter(c => c.type !== 'view')
    .sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    db: DB,
    source: SRC_URI.replace(/\/\/[^@]*@/, '//<redacted>@'),
    createdAt: new Date().toISOString(),
    collections: {},
  };

  for (const c of cols) {
    const docs = await db.collection(c.name).find({}).toArray();
    const file = path.join(dbDir, `${c.name}.json`);
    fs.writeFileSync(file, EJSON.stringify(docs, null, 2, { relaxed: false }));
    manifest.collections[c.name] = docs.length;
    console.log(`  ${c.name.padEnd(24)} ${String(docs.length).padStart(6)}  -> ${path.relative(PROJ_ROOT, file)}`);
  }

  fs.writeFileSync(path.join(dbDir, '_manifest.json'), JSON.stringify(manifest, null, 2));
  const total = Object.values(manifest.collections).reduce((s, n) => s + n, 0);
  console.log(`\nColecciones: ${cols.length}   Documentos: ${total}`);
  await client.close();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
