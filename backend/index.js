require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarDB = require('./src/config/database');
const router = require('./src/routes/router');

const app = express();
const port = process.env.PORT || 3000;

conectarDB();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`API ejecutándose en http://localhost:${port}`);
});
