const db = require('../database/database');

const findUserByUsername = (username, callback) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

const findUserById = (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, row);
    });
};

const createUser = (username, password, role, callback) => {
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID);
    });
};

const updateUser = (id, username, password, callback) => {
    db.run('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null);
    });
};

const getAllData = (callback) => {
    const data = {};

    db.all('SELECT * FROM users', (err, users) => {
        if (err) {
            return callback(err); // Devuelve el error al callback
        }
        data.users = users;

        db.all('SELECT * FROM ingredients', (err, ingredients) => {
            if (err) {
                return callback(err); // Devuelve el error al callback
            }
            data.ingredients = ingredients;

            callback(null, data); // Llama al callback con los datos si todo está bien
        });
    });
};

module.exports = { findUserByUsername, findUserById, createUser, updateUser, getAllData };