const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { findUserById, updateUser } = require('../models/User.js');

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para buscar un usuario por su ID
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    findUserById(userId, (err, user) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user); // Devuelve el usuario encontrado
    });
});

// Ruta para actualizar un usuario por su ID
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body;

    findUserById(userId, (err, user) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar usuario
        updateUser(userId, username, password, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json({ message: 'Usuario actualizado correctamente' });
        });
    });
});

module.exports = router;
