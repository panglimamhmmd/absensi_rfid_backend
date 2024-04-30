// import {Sequelize} from "sequelize";

// const db = new Sequelize('auth_db', 'root', '', {
//     host: "localhost",
//     dialect: "mysql"
// });

import { Sequelize } from 'sequelize';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

export default db;
