const db = require('../database/database');
const { findUserByUsername, findUserById, createUser, updateUser, getAllData } = require('../models/User');

jest.mock('../database/database');

describe('findUserByUsername Function Tests', () => {
    // Limpiar mocks antes de cada prueba
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return user when found by username', async () => {
        const username = 'testuser';
        const expectedUser = { id: 1, username: 'testuser', password: 'password', role: 'user' };

        // Configurar el mock de db.get para simular encontrar el usuario
        db.get.mockImplementation((query, params, callback) => {
            callback(null, expectedUser); // Simula que se encontró el usuario
        });

        // Usar una promesa para esperar el callback de findUserByUsername
        await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(user).toEqual(expectedUser);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when user not found by username', async () => {
        const username = 'nonexistentuser';

        // Configurar el mock de db.get para simular no encontrar el usuario
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null); // Simula que no se encontró el usuario
        });

        // Usar una promesa para esperar el callback de findUserByUsername
        await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(user).toBeNull();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs', async () => {
        const username = 'testuser';

        // Configurar el mock de db.get para simular un error de base de datos
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de findUserByUsername
        await new Promise((resolve, reject) => {
            findUserByUsername(username, (err, user) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    expect(user).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return user when found by id', async () => {
        const id = 1;
        const expectedUser = { id: 1, username: 'testuser', password: 'password', role: 'user' };

        // Configurar el mock de db.get para simular encontrar el usuario por id
        db.get.mockImplementation((query, params, callback) => {
            callback(null, expectedUser); // Simula que se encontró el usuario
        });

        // Usar una promesa para esperar el callback de findUserById
        await new Promise((resolve, reject) => {
            findUserById(id, (err, user) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(user).toEqual(expectedUser);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when user not found by id', async () => {
        const id = 999;

        // Configurar el mock de db.get para simular no encontrar el usuario por id
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null); // Simula que no se encontró el usuario
        });

        // Usar una promesa para esperar el callback de findUserById
        await new Promise((resolve, reject) => {
            findUserById(id, (err, user) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(user).toBeNull();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs', async () => {
        const id = 1;

        // Configurar el mock de db.get para simular un error de base de datos
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de findUserById
        await new Promise((resolve, reject) => {
            findUserById(id, (err, user) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    expect(user).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return JSON-RPC format when user created successfully', async () => {
        const params = {
            username: 'testuser',
            password: 'password',
            role: 'user'
        };

        // Configurar el mock de db.run para simular una inserción exitosa
        db.run.mockImplementation((query, params, callback) => {
            callback(null, { lastID: 1 }); // Simula que se creó el usuario con id 1
        });

        // Usar una promesa para esperar el callback de createUser
        const result = await new Promise((resolve, reject) => {
            createUser(params.username, params.password, params.role, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    });

    test('should return error when database error occurs during creation', async () => {
        const username = 'testuser';
        const password = 'password';
        const role = 'user';

        // Configurar el mock de db.run para simular un error de base de datos
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de createUser
        await new Promise((resolve, reject) => {
            createUser(username, password, role, (err, userId) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    expect(userId).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });


    test('should return error when database error occurs during creation', async () => {
        const username = 'testuser';
        const password = 'password';
        const role = 'user';

        // Configurar el mock de db.run para simular un error de base de datos
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de createUser
        await new Promise((resolve, reject) => {
            createUser(username, password, role, (err, userId) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    expect(userId).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return success when user updated successfully', async () => {
        const id = 1;
        const username = 'updateduser';
        const password = 'updatedpassword';

        // Configurar el mock de db.run para simular una actualización exitosa
        db.run.mockImplementation((query, params, callback) => {
            callback(null); // Simula que se actualizó el usuario correctamente
        });

        // Usar una promesa para esperar el callback de updateUser
        await new Promise((resolve, reject) => {
            updateUser(id, username, password, (err) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during update', async () => {
        const id = 1;
        const username = 'updateduser';
        const password = 'updatedpassword';

        // Configurar el mock de db.run para simular un error de base de datos
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de updateUser
        await new Promise((resolve, reject) => {
            updateUser(id, username, password, (err) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return all data when retrieved successfully', async () => {
        const expectedData = {
            users: [{ id: 1, username: 'testuser', password: 'password', role: 'user' }],
            ingredients: [{ id: 1, name: 'ingredient1' }, { id: 2, name: 'ingredient2' }]
        };

        // Configurar el mock de db.all para simular la obtención de datos exitosa
        db.all.mockImplementation((query, callback) => {
            if (query === 'SELECT * FROM users') {
                callback(null, expectedData.users); // Simula obtener usuarios
            } else if (query === 'SELECT * FROM ingredients') {
                callback(null, expectedData.ingredients); // Simula obtener ingredientes
            }
        });

        // Usar una promesa para esperar el callback de getAllData
        await new Promise((resolve, reject) => {
            getAllData((err, data) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(data).toEqual(expectedData);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs during data retrieval', async () => {
        // Configurar el mock de db.all para simular un error de base de datos
        db.all.mockImplementation((query, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error de base de datos
        });

        // Usar una promesa para esperar el callback de getAllData
        await new Promise((resolve, reject) => {
            getAllData((err, data) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error
                    expect(data).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
    
    test('should return error when database error occurs during ingredients retrieval', async () => {
        // Configurar el mock de db.all para simular un error al recuperar ingredientes
        db.all.mockImplementation((query, callback) => {
            if (query === 'SELECT * FROM users') {
                callback(null, []); // Simula obtener usuarios vacíos (no es relevante para esta prueba)
            } else if (query === 'SELECT * FROM ingredients') {
                callback(new Error('Error de base de datos al obtener ingredientes')); // Simula un error de base de datos
            }
        });

        // Usar una promesa para esperar el callback de getAllData
        await new Promise((resolve, reject) => {
            getAllData((err, data) => {
                try {
                    expect(err).toBeInstanceOf(Error); // Se espera un error de base de datos
                    expect(data).toBeUndefined(); // No se espera datos debido al error
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
});
