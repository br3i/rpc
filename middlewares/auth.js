const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = 'your_secret_key';

const login = (username, password, callback) => {
    console.log(`Intento de inicio de sesión para el usuario: ${username}`);
    User.findUserByUsername(username, (err, user) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return callback('Error en el servidor');
        }
        if (!user) {
            console.log(`Usuario '${username}' no encontrado`);
            return callback('Usuario no encontrado');
        }
        console.log(`Usuario encontrado: ${JSON.stringify(user)}`);
        console.log(`Contraseña ingresada: ${password}`);
        console.log(`Contraseña almacenada (hash): ${user.password}`);

         if (password !== user.password) {
            console.log(`Contraseña incorrecta para el usuario '${username}'`);
            return callback('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });
        console.log(`Inicio de sesión exitoso para el usuario '${username}'`);
        callback(null, token);
    });
};


const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Token is missing');
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }

        req.user = user;
        next();
    });
};

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).send('Forbidden');
    }
    next();
};


module.exports = {
    authenticate,
    authorize,
    login,
};
