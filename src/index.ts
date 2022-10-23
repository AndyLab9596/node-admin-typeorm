require('dotenv').config();

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { DataSource } from 'typeorm';
import { routes } from './routes';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123qweasd",
    database: "node_admin",
    entities: [
        "src/entity/*.ts"
    ],
    logging: false,
    synchronize: true
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        const app = express();

        app.use(express.json());
        app.use(cookieParser());

        app.use(cors({
            credentials: true,
            origin: ["http://localhost:3000"]
        }))

        routes(app)

        app.listen(8000, () => {
            console.log(`listening on port 8000`)
        })
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

