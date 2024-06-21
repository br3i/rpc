const db = require('../database/database');

// Función para crear un nuevo ingrediente
const createIngredient = (params, callback) => {
    const { name, quantity, description } = params;

    console.log('Intentando crear ingrediente:', params); // Registro de depuración

    // Verificar si el ingrediente ya existe
    db.get('SELECT * FROM ingredients WHERE name = ?', [name], (err, row) => {
        if (err) {
            console.error('Error al verificar ingrediente:', err); // Registro de depuración
            return callback({ code: -32000, message: 'Error al verificar ingrediente' });
        }

        // Si el ingrediente ya existe, devolver un mensaje de error
        if (row) {
            console.warn('Ingrediente ya existe:', row); // Registro de depuración
            return callback({ code: -32001, message: 'El ingrediente ya existe' });
        }

        // Si no existe, crear el nuevo ingrediente
        db.run('INSERT INTO ingredients (name, quantity, description) VALUES (?, ?, ?)', [name, quantity, description], (err) => {
            if (err) {
                console.error('Error al crear ingrediente:', err); // Registro de depuración
                return callback({ code: -32000, message: 'Error al crear ingrediente' });
            }
            console.log('Ingrediente creado correctamente'); // Registro de depuración
            callback(null, { message: 'Ingrediente creado correctamente' });
        });
    });
};

// Función para leer un ingrediente
const readIngredient = (params, callback) => {
    const { id } = params;

    console.log('Intentando leer ingrediente con id:', id); // Registro de depuración

    db.get('SELECT * FROM ingredients WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error al obtener ingrediente:', err); // Registro de depuración
            return callback({ code: -32000, message: 'Error al obtener ingrediente' });
        }

        // Si el ingrediente no se encuentra, devolver un mensaje de error
        if (!row) {
            console.warn('Ingrediente no encontrado:', id); // Registro de depuración
            return callback({ code: -32001, message: 'Ingrediente no encontrado' });
        }

        console.log('Ingrediente encontrado:', row); // Registro de depuración
        callback(null, row);
    });
};

// Función para actualizar un ingrediente
const updateIngredient = (params, callback) => {
    const { id, name, quantity, description } = params;

    console.log('Intentando actualizar ingrediente:', params); // Registro de depuración

    db.run('UPDATE ingredients SET name = ?, quantity = ?, description = ? WHERE id = ?', [name, quantity, description, id], (err) => {
        if (err) {
            console.error('Error al actualizar ingrediente:', err); // Registro de depuración
            return callback({ code: -32000, message: 'Error al actualizar ingrediente' });
        }

        console.log('Ingrediente actualizado correctamente'); // Registro de depuración
        callback(null, { message: 'Ingrediente actualizado correctamente' });
    });
};

// Función para eliminar un ingrediente
const deleteIngredient = (params, callback) => {
    const { id } = params;

    console.log('Intentando eliminar ingrediente con id:', id); // Registro de depuración

    db.run('DELETE FROM ingredients WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar ingrediente:', err); // Registro de depuración
            return callback({ code: -32000, message: 'Error al eliminar ingrediente' });
        }

        console.log('Ingrediente eliminado correctamente'); // Registro de depuración
        callback(null, { message: 'Ingrediente eliminado correctamente' });
    });
};

module.exports = {
    createIngredient,
    readIngredient,
    updateIngredient,
    deleteIngredient,
};
