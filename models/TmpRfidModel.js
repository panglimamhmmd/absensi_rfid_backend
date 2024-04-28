import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const TmpRfid = db.define(
    'tmprfid',
    {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        nokartu: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        mode: {
            type: DataTypes.STRING,
        },
    },
    {
        freezeTableName: true,
    }
);

export default TmpRfid;
