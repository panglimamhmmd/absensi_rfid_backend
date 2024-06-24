import TmpRfid from '../models/TmpRfidModel.js';
import Absen from '../models/AbsenModel.js';
import Users from '../models/UserModel.js';

export const getNoKartu = async (req, res) => {
    //mendapatkan nokartu terbaru
    try {
        const response = await TmpRfid.findOne({
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({ msg: response });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const createNoKartu = async (req, res) => {
    const nokartu = req.params.nokartu;
    const mode = req.params.mode;

    // cek jika user valid
    const match = await Users.findOne({
        where: {
            uuid: nokartu,
        },
    });
    // jika user tidak valid, masukkan nokartu pada Tabel TmpRFID
    if (!match) {
        try {
            await TmpRfid.create({
                nokartu: nokartu,
            });
            return res.status(404).json({ msg: 'Kartu Tidak Valid!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    const userId = match.id;
    const userName = match.name;
    const currentDate = new Date().toLocaleDateString(); // ambil waktu saat ini
    let time = new Date();

    const hours =
        time.getHours().toString().length == 1
            ? `0${time.getHours()}`
            : time.getHours().toString();
    const minutes =
        time.getMinutes().toString().length == 1
            ? `0${time.getMinutes()}`
            : time.getMinutes().toString();

    const jam = `${hours}:${minutes}`;
    if (mode == 1) {
        // cek jika sudah absensi sebelumnya
        const user = await Absen.findOne({
            where: {
                tanggal: currentDate,
                userId: userId,
            },
        });

        if (user) return res.status(400).json({ msg: 'Anda Sudah Tap In' }); // jika user tap in dua kali

        try {
            await Absen.create({
                userId: userId,
                tanggal: currentDate,
                jam_masuk: jam,
            });
            res.status(200).json({
                msg: `Selamat Datang ${userName}`,
            });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
    // ! MODE KELUAR
    if (mode == 2) {
        try {
            // hindari double tap
            const user = await Absen.findOne({
                where: {
                    tanggal: currentDate,
                    userId: userId,
                },
            });

            if (!user) {
                return res
                    .status(401)
                    .json({ msg: 'Mohon Tap In Terlebih Dahulu ' });
            }

            if (user.jam_keluar) {
                return res
                    .status(400)
                    .json({ msg: 'Anda Sudah Melakukan Tap Out' });
            }

            await Absen.update(
                { jam_keluar: jam },
                {
                    where: {
                        userId: userId,
                    },
                }
            );

            res.status(201).json({ msg: `Selamat Tinggal ${userName}` });
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
};

export const deleteNoKartu = async (req, res) => {
    try {
        await TmpRfid.truncate();
        res.status(200).json({ msg: 'TmpRFID Eresed' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const prosesAbsensi = async (req, res) => {
    try {
        const absensi = await TmpRfid.findOne({
            where: {
                id: 13,
            },
        });

        res.status(200).json({ absensi });
    } catch (error) {
        res.status(400).json({ msg: error.mesage });
    }
};
