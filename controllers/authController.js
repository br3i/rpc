const db = require('../database/database');

// Función para autenticar usuario
const login = (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error interno al autenticar' });
        }

        if (!row) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Usuario autenticado correctamente
        res.json({
            id: row.id,
            username: row.username,
            role: row.role
        });
    });
};

module.exports = {
    login,
};
