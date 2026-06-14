require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/database');
const router = require('./routes/router');

const app = express();
const port = process.env.PORT || 3000;

conectarDB();

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

app.use(router);

app.listen(port, () => {
    console.log(`API ejecutándose en http://localhost:${port}`);
});
