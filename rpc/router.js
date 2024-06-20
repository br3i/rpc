const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController'); // Controlador de usuarios

const router = express.Router();

router.use(bodyParser.json());

router.post('/create', (req, res) => {
    userController.createUser(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

router.post('/login', (req, res) => {
    userController.login(req.body, (err, result) => {
        if (err) {
            // Manejar errores generales de la base de datos u otros
            return res.status(500).json({ error: err.message });
        }
        // En otros casos, devolver el resultado normalmente
        res.json(result);
    });
});


router.post('/update', (req, res) => {
    userController.updateUser(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

router.post('/delete', (req, res) => {
    userController.deleteUser(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

module.exports = router;
