import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import fs from 'fs';
import https from 'https';
// routes
import UserRoute from './routes/UserRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import AbsensiRoute from './routes/AbsensiRoute.js';
import TmpRfidRoute from './routes/TmpRfidRoute.js';
import Absen from './models/AbsenModel.js';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db,
});

// (async () => {
//     // await Absen.sync({ force: true });
//     await db.sync();
// })();

// db.sync();

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        store: store,
        proxy: true,
        cookie: {
            secure: 'auto',
            sameSite: 'none',
        },
    })
);

app.use(
    cors({
        credentials: true,
        origin: `${process.env.CLIENT_DOMAIN}`, // ganti alamat ip server front-end
    })
);
app.use(express.json());

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(AbsensiRoute);
app.use(TmpRfidRoute);

// store.sync();

// SSL Instalation

// var privateKey = fs.readFileSync('./cert/privatekey.pem');
// var certificate = fs.readFileSync('./cert/originkey.pem');

// https
//     .createServer(
//         {
//             key: privateKey,
//             cert: certificate,
//         },
//         app
//     )
//     .listen(process.env.APP_PORT);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running at port ${process.env.APP_PORT} `);
});
