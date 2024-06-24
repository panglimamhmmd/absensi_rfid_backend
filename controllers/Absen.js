import Absen from '../models/AbsenModel.js';
import User from '../models/UserModel.js';
import { Op } from 'sequelize';
import Sequelize from 'sequelize';
export const getAbsensi = async (req, res) => {
    const { year, month, userId } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    let response;
    try {
        // Determine date range
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${new Date(
            year,
            month,
            0
        ).getDate()}`;

        if (year && month && userId) {
            // User monthly
            response = await Absen.findAll({
                where: {
                    createdAt: {
                        [Sequelize.Op.between]: [startDate, endDate],
                    },
                    userId: req.role === 'admin' ? userId : req.userId,
                },
                order: [['createdAt', 'ASC']],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        } else if (year && month) {
            // Monthly
            response = await Absen.findAll({
                where: {
                    createdAt: {
                        [Sequelize.Op.between]: [startDate, endDate],
                    },
                    ...(req.role !== 'admin' && { userId: req.userId }),
                },
                order: [['createdAt', 'ASC']],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
            });
        } else if (!year && !month && !userId) {
            // Newest
            response = await Absen.findAll({
                where: {
                    ...(req.role !== 'admin' ? { userId: req.userId } : {}),
                    createdAt: {
                        [Op.gte]: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth(),
                            1
                        ),
                        [Op.lt]: new Date(
                            new Date().getFullYear(),
                            new Date().getMonth() + 1,
                            1
                        ),
                    },
                },
                include: [
                    {
                        model: User,
                        attributes: ['name', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }

        if (!response || response.length === 0) {
            return res.status(404).json({ msg: 'Data tidak ditemukan' });
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = response.slice(startIndex, endIndex);

        const totalPages = Math.ceil(response.length / limit);
        const prev = page > 1 ? page - 1 : null;
        const next = page < totalPages ? page + 1 : null;

        const pagination = {
            currentPage: page,
            limit: limit,
            next: next,
            prev: prev,
            totalData: response.length,
            totalPage: totalPages,
        };

        res.status(200).json({ data: result, pagination });
    } catch (error) {
        console.error('Error:', error);
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
    const { nokartu, jam_masuk, jam_keluar, createdAt } = req.body;
    const currentDate = new Date().toLocaleDateString();
    try {
        await Absen.create({
            nokartu: nokartu,
            jam_masuk: jam_masuk,
            jam_keluar: jam_keluar,
            tanggal: currentDate,
            userId: req.userId,
            createdAt: createdAt,
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
        const absen = await Absen.findOne({
            where: {
                uuid: req.params.id,
            },
        });
        if (!absen)
            return res.status(404).json({ msg: 'Data tidak ditemukan' });

        if (req.role === 'admin') {
            await Absen.destroy({
                where: {
                    uuid: absen.uuid,
                },
            });
        } else {
            if (req.userId !== absen.userId)
                return res.status(403).json({ msg: 'Akses terlarang' });
            await Absen.destroy({
                where: {
                    [Op.and]: [{ id: absen.id }, { userId: req.userId }],
                },
            });
        }
        res.status(200).json({ msg: 'Product deleted successfuly' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// extend data

// get today absensi

export const getTodayAbsensi = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    try {
        const absensi = await Absen.findAll({
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd],
                },
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'email'],
                },
            ],
        });
        res.status(200).json(absensi);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// get dashboard data. total user, total today absensi, total absensi bulan ini

export const getDashboardInfo = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    // get total user
    try {
        const totalUser = await User.count();
        // get total today absensi
        const totalTodayAbsensi = await Absen.count({
            where: {
                createdAt: {
                    [Op.between]: [todayStart, todayEnd],
                },
            },
        });
        // get total absensi bulan ini
        const totalAbsensiBulanIni = await Absen.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    ),
                },
            },
        });

        res.status(200).json({
            totalUser,
            totalTodayAbsensi,
            totalAbsensiBulanIni,
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const recapMonthly = async (req, res) => {
    // recap monthly absensi per userId

    try {
        const absensi = await Absen.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    ),
                },
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'email'],
                },
            ],
        });

        const getUserId = absensi.map((absen) => absen.userId);
        const uniqueUserId = [...new Set(getUserId)];
        // sum all data in absensi per user

        for (let i = 0; i < uniqueUserId.length; i++) {
            const sumAbsensi = await Absen.sum('jml_siswa', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
            const sumSoal = await Absen.sum('jml_soal', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
            const sumKetik = await Absen.sum('jml_ketik', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
            const sumPaket = await Absen.sum('jml_paket', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
            await Absen.sum('jml_quiziz', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
            const sumLain = await Absen.sum('lain_lain', {
                where: {
                    userId: uniqueUserId[i],
                },
            });
        }
    } catch (error) {}
};
