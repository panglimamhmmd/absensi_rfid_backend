import User from '../models/UserModel.js';
import argon2 from 'argon2';

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        },
    });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({ msg: 'Wrong Password' });
    req.session.userId = user.uuid;
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
        console.log('Session after setting userId:', req.session);
        res.status(200).json({
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    });
};

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ msg: 'Mohon login ke akun Anda!' });
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId,
        },
    });
    if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' });
    res.status(200).json(user);
};

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: 'Tidak dapat logout' });
        res.status(200).json({ msg: 'Anda telah logout' });
    });
};
