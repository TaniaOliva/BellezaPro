/*
 * Orquestador: carga backend/.env y ejecuta las tareas de migración sin
 * exponer credenciales en la línea de comandos.
 *
 *   node scripts/migrate.js dump              # respalda LOCAL_URI -> respaldo/
 *   node scripts/migrate.js restore [--force] # respaldo/ -> DEST_URI
 *   node scripts/migrate.js verify            # compara LOCAL_URI vs DEST_URI
 *
 * Variables (backend/.env):
 *   LOCAL_URI  origen del dump          (default: mongodb://localhost:27017)
 *   DEST_URI   destino / Atlas          (default: MONGODB_URI)
 *   MIGRATE_DB nombre de la base        (default: bellezapro)
 */
const path = require('path');
const { spawnSync } = require('child_process');

require(path.join(__dirname, '..', 'node_modules', 'dotenv'))
  .config({ path: path.join(__dirname, '..', '.env') });

const LOCAL = process.env.LOCAL_URI || 'mongodb://localhost:27017';
const DEST = process.env.DEST_URI || process.env.MONGODB_URI;
const DB = process.env.MIGRATE_DB || 'bellezapro';

const task = process.argv[2];
const extra = process.argv.slice(3);
let args;

if (task === 'dump') {
  args = [path.join(__dirname, 'dump-local.js'), LOCAL, DB];
} else if (task === 'restore') {
  if (!DEST) { console.error('Falta DEST_URI / MONGODB_URI en backend/.env'); process.exit(1); }
  args = [path.join(__dirname, 'restore-atlas.js'), DEST, DB, path.join(__dirname, '..', '..', 'respaldo'), ...extra];
} else if (task === 'verify') {
  if (!DEST) { console.error('Falta DEST_URI / MONGODB_URI en backend/.env'); process.exit(1); }
  args = [path.join(__dirname, 'verify-migration.js'), LOCAL, DEST, DB];
} else {
  console.error('Tareas: dump | restore [--force] | verify');
  process.exit(1);
}

process.exit(spawnSync(process.execPath, args, { stdio: 'inherit' }).status ?? 1);
