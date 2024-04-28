import Absen from '../models/AbsenModel.js';
import User from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getAbsensi = async (req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Absen.findAll({
                // attributes: ['uuid', 'name', 'price'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        } else {
            response = await Absen.findAll({
                // attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId,
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getAbsensiById = async (req, res) => {
    try {
        const absensi = await Absen.findOne({
            where: {
                uuid: req.params.id,
            },
        });
        if (!absensi)
            return res.status(404).json({ msg: 'Data tidak ditemukan' });
        let response;
        if (req.role === 'admin') {
            response = await Absen.findOne({
                // attributes: ['uuid', 'name', 'price'],
                where: {
                    id: absensi.id,
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        } else {
            response = await Absen.findOne({
                // attributes: ['uuid', 'name', 'price'],
                where: {
                    [Op.and]: [{ id: absensi.id }, { userId: req.userId }],
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAbsensi = async (req, res) => {
    const { nokartu, jam_masuk, jam_keluar } = req.body;
    const currentDate = new Date().toLocaleDateString();
    try {
        await Absen.create({
            nokartu: nokartu,
            jam_masuk: jam_masuk,
            jam_keluar: jam_keluar,
            tanggal: currentDate,
            userId: req.userId,
        });
        res.status(201).json({ msg: 'Absen Created Successfuly' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAbsensi = async (req, res) => {
    try {
        const absensi = await Absen.findOne({
            where: {
                uuid: req.params.id,
            },
        });
        if (!absensi)
            return res.status(404).json({ msg: 'Data tidak ditemukan' });
        const {
            jam_masuk,
            jam_keluar,
            jml_siswa,
            jml_soal,
            jml_ketik,
            jml_paket,
            jml_quiziz,
            lain_lain,
        } = req.body;
        if (req.role === 'admin') {
            await Absen.update(
                {
                    jam_masuk,
                    jam_keluar,
                    jml_siswa,
                    jml_soal,
                    jml_ketik,
                    jml_paket,
                    jml_quiziz,
                    lain_lain,
                },
                {
                    where: {
                        id: absensi.id,
                    },
                }
            );
        } else {
            if (req.userId !== absensi.userId)
                return res.status(403).json({ msg: 'Akses terlarang' });
            await Absen.update(
                {
                    jam_masuk,
                    jam_keluar,
                    jml_siswa,
                    jml_soal,
                    jml_ketik,
                    jml_paket,
                    jml_quiziz,
                    lain_lain,
                },
                {
                    where: {
                        [Op.and]: [{ id: absensi.id }, { userId: req.userId }],
                    },
                }
            );
        }
        res.status(200).json({ msg: 'Absensi updated successfuly' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAbsensi = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id,
            },
        });
        if (!product)
            return res.status(404).json({ msg: 'Data tidak ditemukan' });
        const { name, price } = req.body;
        if (req.role === 'admin') {
            await Product.destroy({
                where: {
                    id: product.id,
                },
            });
        } else {
            if (req.userId !== product.userId)
                return res.status(403).json({ msg: 'Akses terlarang' });
            await Product.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }],
                },
            });
        }
        res.status(200).json({ msg: 'Product deleted successfuly' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
