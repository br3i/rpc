const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { login } = require('../middlewares/auth');
const router = express.Router();

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        User.createUser(username, hash, role, (err, userId) => {
            if (err) return res.status(500).send('Error creating user');
            res.status(201).send({ userId });
        });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Intento de inicio de sesión para el usuario: ${username}`);
    login(username, password, (err, token) => {
        if (err) {
            console.error('Error en inicio de sesión:', err);
            return res.status(400).send(err);
        }
        console.log(`Inicio de sesión exitoso para el usuario '${username}'`);
        res.send({ token });
    });
});

module.exports = router;
