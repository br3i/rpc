const db = require('../database/database');
const { createUser, login, updateUser, deleteUser } = require('../controllers/userController');

jest.mock('../database/database');

describe('User Controller Tests', () => {
    // Limpiar mocks antes de cada prueba
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new user', async () => {
        // Configurar el mock de db.get para simular que el usuario no existe
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null); // Simula que el usuario no existe
        });

        // Configurar el mock de db.run para simular la inserción del usuario
        db.run.mockImplementation((query, params, callback) => {
            callback(null); // Simula que la inserción fue exitosa
        });

        const params = {
            username: 'testuser',
            password: 'testpassword',
            role: 'user'
        };

        // Usar una promesa para esperar el callback de createUser
        await new Promise((resolve, reject) => {
            createUser(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // Verifica que no haya error
                    expect(result.message).toBe('Usuario creado correctamente');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when user already exists', async () => {
        // Configurar el mock de db.get para simular que el usuario ya existe
        const existingUser = {
            username: 'testuser',
            password: 'hashedpassword',
            role: 'user'
        };
        db.get.mockImplementation((query, params, callback) => {
            callback(null, existingUser); // Simula que el usuario ya existe
        });

        const params = {
            username: 'testuser',
            password: 'testpassword',
            role: 'user'
        };

        // Usar una promesa para esperar el callback de createUser
        await new Promise((resolve, reject) => {
            createUser(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32001, message: 'El usuario ya existe' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when database error occurs while creating user', async () => {
        // Configurar el mock de db.get para simular un error al verificar usuario
        db.get.mockImplementation((query, params, callback) => {
            callback(new Error('Database error')); // Simula un error al verificar usuario
        });

        const params = {
            username: 'testuser',
            password: 'testpassword',
            role: 'user'
        };

        // Usar una promesa para esperar el callback de createUser
        await new Promise((resolve, reject) => {
            createUser(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al verificar usuario' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should successfully login with correct credentials', async () => {
        const user = {
            username: 'testuser',
            password: 'correctpassword'
        };
        // Configurar el mock de db.get para simular el usuario encontrado
        db.get.mockImplementation((query, params, callback) => {
            callback(null, user); // Simula que el usuario existe en la base de datos
        });

        const params = {
            username: 'testuser',
            password: 'correctpassword'
        };

        // Usar una promesa para esperar el callback de login
        await new Promise((resolve, reject) => {
            login(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(result.message).toBe('Inicio de sesión exitoso');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when user is not found', async () => {
        // Configurar el mock de db.get para simular que el usuario no existe
        db.get.mockImplementation((query, params, callback) => {
            callback(null, null); // Simula que el usuario no existe en la base de datos
        });

        const params = {
            username: 'nonexistentuser',
            password: 'anypassword'
        };

        // Usar una promesa para esperar el callback de login
        await new Promise((resolve, reject) => {
            login(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Usuario no encontrado' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when password is incorrect', async () => {
        const user = {
            username: 'testuser',
            password: 'correctpassword'
        };
        // Configurar el mock de db.get para simular el usuario encontrado
        db.get.mockImplementation((query, params, callback) => {
            callback(null, user); // Simula que el usuario existe en la base de datos
        });

        const params = {
            username: 'testuser',
            password: 'incorrectpassword' // Contraseña incorrecta
        };

        // Usar una promesa para esperar el callback de login
        await new Promise((resolve, reject) => {
            login(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32001, message: 'Contraseña incorrecta' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should successfully update user', async () => {
        const params = {
            id: 1,
            username: 'newusername',
            password: 'newpassword'
        };

        // Configurar el mock de db.run para simular una actualización exitosa
        db.run.mockImplementation((query, params, callback) => {
            callback(null); // Simula que la actualización fue exitosa
        });

        // Usar una promesa para esperar el callback de updateUser
        await new Promise((resolve, reject) => {
            updateUser(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(result.message).toBe('Usuario actualizado correctamente');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when update fails', async () => {
        const params = {
            id: 1,
            username: 'newusername',
            password: 'newpassword'
        };

        // Configurar el mock de db.run para simular un error al actualizar
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error al actualizar
        });

        // Usar una promesa para esperar el callback de updateUser
        await new Promise((resolve, reject) => {
            updateUser(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al actualizar usuario' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should successfully delete user', async () => {
        const params = {
            id: 1
        };

        // Configurar el mock de db.run para simular una eliminación exitosa
        db.run.mockImplementation((query, params, callback) => {
            callback(null); // Simula que la eliminación fue exitosa
        });

        // Usar una promesa para esperar el callback de deleteUser
        await new Promise((resolve, reject) => {
            deleteUser(params, (err, result) => {
                try {
                    expect(err).toBeNull(); // No se espera error
                    expect(result.message).toBe('Usuario eliminado correctamente');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });

    test('should return error when delete fails', async () => {
        const params = {
            id: 1
        };

        // Configurar el mock de db.run para simular un error al eliminar
        db.run.mockImplementation((query, params, callback) => {
            callback(new Error('Error de base de datos')); // Simula un error al eliminar
        });

        // Usar una promesa para esperar el callback de deleteUser
        await new Promise((resolve, reject) => {
            deleteUser(params, (err, result) => {
                try {
                    expect(err).toEqual({ code: -32000, message: 'Error al eliminar usuario' });
                    expect(result).toBeUndefined();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
});
