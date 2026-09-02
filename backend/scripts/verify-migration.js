/*
 * Compara conteos de documentos entre dos bases (origen y destino).
 *
 * Uso:
 *   node scripts/verify-migration.js "<uri_origen>" "<uri_destino>" ["<db>"]
 * Default db: bellezapro
 */
const { MongoClient } = require('mongodb');

const SRC_URI = process.argv[2] || 'mongodb://localhost:27017';
const DST_URI = process.argv[3];
const DB = process.argv[4] || 'bellezapro';

if (!DST_URI) { console.error('Falta <uri_destino>'); process.exit(1); }

async function counts(uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  await client.connect();
  const db = client.db(DB);
  const cols = (await db.listCollections().toArray()).filter(c => c.type !== 'view');
  const out = {};
  for (const c of cols) out[c.name] = await db.collection(c.name).countDocuments();
  await client.close();
  return out;
}

(async () => {
  const [src, dst] = await Promise.all([counts(SRC_URI), counts(DST_URI)]);
  const names = [...new Set([...Object.keys(src), ...Object.keys(dst)])].sort();
  const rows = names.map(n => ({
    coleccion: n,
    origen: src[n] ?? '-',
    destino: dst[n] ?? '-',
    ok: (src[n] ?? 0) === (dst[n] ?? 0) ? 'OK' : 'DIFERENCIA',
  }));
  console.table(rows);
  const ts = Object.values(src).reduce((s, n) => s + n, 0);
  const td = Object.values(dst).reduce((s, n) => s + n, 0);
  console.log(`TOTAL  origen=${ts}  destino=${td}`);
  const allOk = rows.every(r => r.ok === 'OK') && ts === td;
  console.log(allOk ? '\nRESULTADO: COINCIDEN' : '\nRESULTADO: NO COINCIDEN');
  process.exit(allOk ? 0 : 1);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
