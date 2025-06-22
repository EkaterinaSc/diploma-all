import express from 'express';
import * as process from "node:process";
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sequelize from "./db.mjs";
import router from "./routes/userRoute.mjs";
import "./models/relations.mjs";
import errFunction from "./middleware/error-mdw.mjs";

const port = process.env.PORT || 5000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
    }
));
app.use('/users', router);
app.use(errFunction);

const buildPath = path.resolve(__dirname, '../front/my-app/build');
console.log('Static path:', buildPath);
//
app.use(express.static(path.resolve(__dirname, '../front/my-app/build')));
//
console.log(`Building ${buildPath}`);

app.get('/', (req, res) => {
    console.log('Serving index.html for:', req.url);
    res.sendFile(path.join(buildPath, 'index.html'), err => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(500).send('Ошибка сервера при отдаче index.html');
        }
    });
});


const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('Подключено к MariaDB');

        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы');

        app.listen(port, () => {
            console.log(`Сервер работает на http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Ошибка подключения к базе данных:', err);
    }
}

start();