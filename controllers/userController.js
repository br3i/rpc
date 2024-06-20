const db = require('../database/database');

// Función para crear un nuevo usuario
const createUser = (params, callback) => {
    const { username, password, role } = params;

    // Verificar si el usuario ya existe
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return callback({ code: -32000, message: 'Error al verificar usuario' });
        }

        // Si el usuario ya existe, devolver un mensaje de error
        if (row) {
            return callback({ code: -32001, message: 'El usuario ya existe' });
        }

        // Si no existe, crear el nuevo usuario
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err) => {
            callback(null, { message: 'Usuario creado correctamente' });
        });
    });
};

// Función para iniciar sesión
const login = (params, callback) => {
    const { username, password } = params;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (!row) {
            return callback({ code: -32000, message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        if (row.password !== password) {
            return callback({ code: -32001, message: 'Contraseña incorrecta' });
        }

        // Si las credenciales son correctas
        callback(null, { message: 'Inicio de sesión exitoso' });
    });
};



// Función para actualizar un usuario
const updateUser = (params, callback) => {
    const { id, username, password } = params;

    db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], (err) => {
        if (err) {
            return callback({ code: -32000, message: 'Error al actualizar usuario' });
        }

        callback(null, { message: 'Usuario actualizado correctamente' });
    });
};

// Función para eliminar un usuario
const deleteUser = (params, callback) => {
    const { id } = params;

    db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) {
            return callback({ code: -32000, message: 'Error al eliminar usuario' });
        }

        callback(null, { message: 'Usuario eliminado correctamente' });
    });
};

module.exports = {
    createUser,
    login,
    updateUser,
    deleteUser,
};
