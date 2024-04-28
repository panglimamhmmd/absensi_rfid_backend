import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const { DataTypes } = Sequelize;

const Absen = db.define(
    'absen',
    {
        tanggal: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [3, 100],
            },
        },
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        jam_masuk: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        jam_keluar: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        jml_siswa: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        jml_soal: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        jml_ketik: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        jml_paket: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        jml_quiziz: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lain_lain: {
            type: DataTypes.STRING,
            defaultValue: '-',
        },
    },
    {
        freezeTableName: true,
    }
);

Users.hasMany(Absen);
Absen.belongsTo(Users);
export default Absen;
