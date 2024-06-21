const db = require('../database/database');
const {
    createIngredient,
    readIngredient,
    updateIngredient,
    deleteIngredient,
} = require('../controllers/ingredientsController');

jest.mock('../database/database');

describe('Ingredient Controller Tests', () => {
    // Limpiar mocks antes de cada prueba
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new ingredient', async () => {
        // Configurar el mock de db.get para simular que el ingrediente no existe
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null); // Simula que el ingrediente no existe
        });

        // Configurar el mock de db.run para simular la inserción del ingrediente
        db.run.mockImplementation((query, params, callback) => {
            callback(null); // Simula que la inserción fue exitosa
        });

        const params = {
            name: 'Test Ingredient',
            quantity: 5,
            description: 'Test Description'
        };

        // Usar una promesa para esperar el callback de createIngredient
        await new Promise((resolve, reject) => {
            createIngredient(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result.message).toBe('Ingrediente creado correctamente');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }, 10000); // Aumenta el timeout a 10 segundos (10000 ms)

    test('should return error if ingredient already exists', async () => {
        const params = {
            name: 'Existing Ingredient',
            quantity: 10,
            description: 'Existing Description'
        };

        // Simular que el ingrediente ya existe
        const existingIngredient = {
            id: 1,
            name: 'Existing Ingredient',
            quantity: 10,
            description: 'Existing Description'
        };

        // Configurar el mock de db.get para devolver un ingrediente existente
        db.get.mockImplementation((query, values, callback) => {
            callback(null, existingIngredient); // Simula que el ingrediente ya existe
        });

        // Usar una promesa para esperar el callback de createIngredient
        await new Promise((resolve, reject) => {
            createIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32001, message: 'El ingrediente ya existe' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

test('should create a new ingredient successfully', async () => {
        const params = {
            name: 'New Ingredient',
            quantity: 5,
            description: 'New Description'
        };

        // Configurar el mock de db.get para simular que el ingrediente no existe
        db.get.mockImplementation((query, values, callback) => {
            callback(null, null); // Simula que el ingrediente no existe
        });

        // Configurar el mock de db.run para simular una inserción exitosa
        db.run.mockImplementation((query, values, callback) => {
            callback(null); // Simula que la inserción fue exitosa
        });

        // Usar una promesa para esperar el callback de createIngredient
        await new Promise((resolve, reject) => {
            createIngredient(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result).toEqual({ message: 'Ingrediente creado correctamente' });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during creation', async () => {
        const params = {
            name: 'New Ingredient',
            quantity: 5,
            description: 'New Description'
        };

        // Configurar el mock de db.get para simular que el ingrediente no existe
        db.get.mockImplementation((query, values, callback) => {
            callback(null, null); // Simula que el ingrediente no existe
        });

        // Configurar el mock de db.run para simular un error durante la inserción
        db.run.mockImplementation((query, values, callback) => {
            callback(new Error('Database error')); // Simula un error al crear el ingrediente
        });

        // Usar una promesa para esperar el callback de createIngredient
        await new Promise((resolve, reject) => {
            createIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al crear ingrediente' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should handle database error when checking if ingredient exists', async () => {
        const params = {
            name: 'Test Ingredient',
            quantity: 5,
            description: 'Test Description'
        };

        // Configurar el mock de db.get para simular un error al verificar el ingrediente
        db.get.mockImplementation((query, values, callback) => {
            callback(new Error('Database error')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de createIngredient
        await new Promise((resolve, reject) => {
            createIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al verificar ingrediente' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should read an existing ingredient', async () => {
        const params = {
            id: 1,
        };

        // Configurar el mock de db.get para simular que el ingrediente existe
        db.get.mockImplementation((query, values, callback) => {
            callback(null, { id: 1, name: 'Test Ingredient', quantity: 5, description: 'Test Description' });
        });

        // Usar una promesa para esperar el callback de readIngredient
        await new Promise((resolve, reject) => {
            readIngredient(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result).toEqual({ id: 1, name: 'Test Ingredient', quantity: 5, description: 'Test Description' });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when ingredient does not exist', async () => {
        const params = {
            id: 999, // ID que no existe
        };

        // Configurar el mock de db.get para simular que el ingrediente no existe
        db.get.mockImplementation((query, values, callback) => {
            callback(null, null); // Simula que no existe el ingrediente
        });

        // Usar una promesa para esperar el callback de readIngredient
        await new Promise((resolve, reject) => {
            readIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32001, message: 'Ingrediente no encontrado' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during read', async () => {
        const params = {
            id: 1,
        };

        // Configurar el mock de db.get para simular un error al leer
        db.get.mockImplementation((query, values, callback) => {
            callback(new Error('Database error')); // Simula un error al leer
        });

        // Usar una promesa para esperar el callback de readIngredient
        await new Promise((resolve, reject) => {
            readIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al obtener ingrediente' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
    test('should update an ingredient successfully', async () => {
        const params = {
            id: 1,
            name: 'Updated Ingredient',
            quantity: 10,
            description: 'Updated Description'
        };

        // Configurar el mock de db.run para simular una actualización exitosa
        db.run.mockImplementation((query, values, callback) => {
            callback(null); // Simula que la actualización fue exitosa
        });

        // Usar una promesa para esperar el callback de updateIngredient
        await new Promise((resolve, reject) => {
            updateIngredient(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result).toEqual({ message: 'Ingrediente actualizado correctamente' });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during update', async () => {
        const params = {
            id: 1,
            name: 'Updated Ingredient',
            quantity: 10,
            description: 'Updated Description'
        };

        // Configurar el mock de db.run para simular un error durante la actualización
        db.run.mockImplementation((query, values, callback) => {
            callback(new Error('Database error')); // Simula un error al actualizar el ingrediente
        });

        // Usar una promesa para esperar el callback de updateIngredient
        await new Promise((resolve, reject) => {
            updateIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al actualizar ingrediente' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should delete an ingredient successfully', async () => {
        const params = {
            id: 1
        };

        // Configurar el mock de db.run para simular una eliminación exitosa
        db.run.mockImplementation((query, values, callback) => {
            callback(null); // Simula que la eliminación fue exitosa
        });

        // Usar una promesa para esperar el callback de deleteIngredient
        await new Promise((resolve, reject) => {
            deleteIngredient(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result).toEqual({ message: 'Ingrediente eliminado correctamente' });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during deletion', async () => {
        const params = {
            id: 1
        };

        // Configurar el mock de db.run para simular un error durante la eliminación
        db.run.mockImplementation((query, values, callback) => {
            callback(new Error('Database error')); // Simula un error al eliminar el ingrediente
        });

        // Usar una promesa para esperar el callback de deleteIngredient
        await new Promise((resolve, reject) => {
            deleteIngredient(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al eliminar ingrediente' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
});