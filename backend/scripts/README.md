# Scripts de migración de base de datos

Herramientas para respaldar la base Mongo local y migrarla a otra instancia
(por ejemplo MongoDB Atlas). Usan el driver `mongodb` que ya viene con
`mongoose` en `backend/node_modules` — no hace falta instalar nada extra ni
tener las MongoDB Database Tools (`mongodump` / `mongorestore`).

Todos los comandos se corren desde la carpeta `backend/`.

## Uso rápido (con `backend/.env`)

```bash
node scripts/migrate.js dump       # respalda la base local en <proyecto>/respaldo/
node scripts/migrate.js restore    # sube respaldo/ a la base de MONGODB_URI (aborta si ya tiene datos)
node scripts/migrate.js verify     # compara conteos: local vs destino
```

Variables opcionales en `backend/.env`:

| Variable | Default | Para qué |
|---|---|---|
| `LOCAL_URI` | `mongodb://localhost:27017` | Origen del respaldo |
| `DEST_URI` | valor de `MONGODB_URI` | Destino de `restore` / `verify` |
| `MIGRATE_DB` | `bellezapro` | Nombre de la base |

`restore` sólo reemplaza datos existentes si se pasa `--force`:

```bash
node scripts/migrate.js restore -- --force
```

## Uso directo (pasando las URIs a mano)

```bash
node scripts/dump-local.js      "mongodb://localhost:27017" bellezapro
node scripts/restore-atlas.js   "mongodb+srv://USER:PASS@cluster.mongodb.net/bellezapro" bellezapro
node scripts/verify-migration.js "mongodb://localhost:27017" "mongodb+srv://USER:PASS@cluster.mongodb.net/bellezapro" bellezapro
```

## Formato del respaldo

`respaldo/<db>/<coleccion>.json` — un archivo por colección en formato EJSON
(preserva `ObjectId`, `Date`, etc.). `respaldo/<db>/_manifest.json` guarda los
conteos y la fecha del respaldo. La carpeta `respaldo/` está en `.gitignore`.
