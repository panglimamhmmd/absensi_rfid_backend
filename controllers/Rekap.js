import Absen from '../models/AbsenModel.js';
import { Model, Sequelize } from 'sequelize';
import Users from '../models/UserModel.js';

export const getRecap = async (req, res) => {
    const { year, month, userId } = req.query;
    let response;

    if (year && month && userId) {
        try {
            if (req.role === 'admin') {
                console.log(`requesting using admin role`);
                response = await Absen.findAll({
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [
                                `${year}-${month}-01`,
                                `${year}-${month}-31`,
                            ],
                        },
                        userId: userId,
                    },
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: Users,
                            attributes: ['name', 'email'],
                        },
                    ],
                });
            } else {
                // role = user
                console.log(req.userId);
                response = await Absen.findAll({
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [
                                `${year}-${month}-01`,
                                `${year}-${month}-31`,
                            ],
                        },
                        userId: req.userId,
                    },
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: Users,
                            attributes: ['name', 'email'],
                        },
                    ],
                });
            }
            if (response.length === 0) {
                return res.status(404).json({ msg: 'Belum ada absensi' });
            }

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }

    if (year && month) {
        try {
            if (req.role === 'admin') {
                response = await Absen.findAll({
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [
                                `${year}-${month}-01`,
                                `${year}-${month}-31`,
                            ],
                        },
                    },
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: Users,
                            attributes: ['name', 'email'],
                        },
                    ],
                });
            } else {
                console.log(`requesting using user role`);
                response = await Absen.findAll({
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [
                                `${year}-${month}-01`,
                                `${year}-${month}-31`,
                            ],
                        },
                        userId: req.userId,
                    },
                    include: [
                        {
                            model: Users,
                            attributes: ['name', 'email'],
                        },
                    ],
                    order: [['createdAt', 'ASC']],
                });
            }

            if (response.length === 0) {
                return res.status(404).json({ data: 'Belum ada absensi' });
            }
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ msg: error.msg });
        }
    }
};
