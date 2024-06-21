const db = require('../database/database');

const createIngredient = (name, quantity, callback) => {
    db.run(`INSERT INTO ingredients (name, quantity) VALUES (?, ?)`, [name, quantity], function(err) {
        callback(err, this.lastID);
    });
};

const getAllIngredients = (callback) => {
    db.all(`SELECT * FROM ingredients`, [], (err, rows) => {
        callback(err, rows);
    });
};

const updateIngredient = (id, name, quantity, callback) => {
    db.run(`UPDATE ingredients SET name = ?, quantity = ? WHERE id = ?`, [name, quantity, id], function(err) {
        callback(err);
    });
};

const deleteIngredient = (id, callback) => {
    db.run(`DELETE FROM ingredients WHERE id = ?`, [id], function(err) {
        callback(err);
    });
};

module.exports = {
    createIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient,
};