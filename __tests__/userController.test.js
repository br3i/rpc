const userController = require('../controllers/userController');
const db = require('../database/database');

jest.mock('../database/database');

describe('User Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });


  
  test('Create User - User already exists', (done) => {
    const mockParams = { username: 'existinguser', password: 'newpass', role: 'user' };
    const mockCallback = jest.fn();

    // Mock para simular que el usuario ya existe en la base de datos
    db.get.mockImplementation((query, params, callback) => {
      callback(null, { username: 'existinguser' });
    });

    userController.createUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith({ code: -32001, message: 'El usuario ya existe' });

    done();
  });

  test('Create User - Database error', (done) => {
    const mockParams = { username: 'newuser', password: 'newpass', role: 'user' };
    const mockCallback = jest.fn();

    // Mock para simular un error en la base de datos
    db.get.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'));
    });

    userController.createUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith({ code: -32000, message: 'Error al verificar usuario' });

    done();
  });

  test('Create User - Success', (done) => {
    const mockParams = { username: 'newuser', password: 'newpass', role: 'user' };
    const mockCallback = jest.fn();

    // Mock para simular que el usuario no existe en la base de datos y se crea correctamente
    db.get.mockImplementation((query, params, callback) => {
      callback(null, null); // Usuario no encontrado
    });
    db.run.mockImplementation((query, params, callback) => {
      callback(null); // Operación de inserción exitosa
    });

    userController.createUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith(null, { message: 'Usuario creado correctamente' });

    done();
  });

  test('Login - Incorrect username', (done) => {
    const mockParams = { username: 'cualquiera', password: 'wrongpass' };
    const mockCallback = jest.fn();

    // Mock para simular credenciales incorrectas
    db.get.mockImplementation((query, params, callback) => {
      callback(null, null);
    });

    userController.login(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith({ code: -32000, message: 'Usuario no encontrado' });

    done();
  });

  test('Login - Incorrect Password', (done) => {
    const mockParams = { username: 'admin', password: 'wrongpass' };
    const mockCallback = jest.fn();

    // Mock para simular que se encuentra el usuario pero la contraseña es incorrecta
    db.get.mockImplementation((query, params, callback) => {
      // Simulamos que encontramos un usuario en la base de datos con el username 'admin'
      if (params[0] === 'admin') {
        callback(null, { username: 'admin', password: 'admin' });
      } else {
        callback(null, null); // Usuario no encontrado para cualquier otro username
      }
    });

    userController.login(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith({ code: -32001, message: 'Contraseña incorrecta' });

    done();
  });
  test('Login - Database error', (done) => {
    const mockParams = { username: 'testuser', password: 'testpass' };
    const mockCallback = jest.fn();

    // Mock para simular un error en la base de datos
    db.get.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'));
    });

    userController.login(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith({ code: -32000, message: 'Usuario no encontrado' });

    done();
  });

  test('Login - Success', (done) => {
    const mockParams = { username: 'testuser', password: 'testpass' };
    const mockCallback = jest.fn();

    // Mock para simular que las credenciales son correctas
    db.get.mockImplementation((query, params, callback) => {
      callback(null, { username: 'testuser', password: 'testpass' });
    });

    userController.login(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto
    expect(mockCallback).toHaveBeenCalledWith(null, { message: 'Inicio de sesión exitoso' });

    done();
  });

  test('Update User - Success', (done) => {
    const mockParams = { id: 1, username: 'updateduser', password: 'newpass' };
    const mockCallback = jest.fn();

    // Simulamos que la actualización en la base de datos fue exitosa
    db.run.mockImplementation((query, params, callback) => {
      callback(null); // Actualización exitosa
    });

    userController.updateUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto de éxito
    expect(mockCallback).toHaveBeenCalledWith(null, { message: 'Usuario actualizado correctamente' });

    done();
  });

  test('Update User - Database Error', (done) => {
    const mockParams = { id: 1, username: 'updateduser', password: 'newpass' };
    const mockCallback = jest.fn();

    // Simulamos un error en la base de datos durante la actualización
    db.run.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'));
    });

    userController.updateUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto de error de base de datos
    expect(mockCallback).toHaveBeenCalledWith({ code: -32000, message: 'Error al actualizar usuario' });

    done();
  });

  test('Delete User - Success', (done) => {
    const mockParams = { id: 1 };
    const mockCallback = jest.fn();

    // Simulamos que la eliminación en la base de datos fue exitosa
    db.run.mockImplementation((query, params, callback) => {
      callback(null); // Eliminación exitosa
    });

    userController.deleteUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto de éxito
    expect(mockCallback).toHaveBeenCalledWith(null, { message: 'Usuario eliminado correctamente' });

    done();
  });

  test('Delete User - Database Error', (done) => {
    const mockParams = { id: 1 };
    const mockCallback = jest.fn();

    // Simulamos un error en la base de datos durante la eliminación
    db.run.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'));
    });

    userController.deleteUser(mockParams, mockCallback);

    // Verificar que la función de callback se llamó con el mensaje correcto de error de base de datos
    expect(mockCallback).toHaveBeenCalledWith({ code: -32000, message: 'Error al eliminar usuario' });

    done();
  });

});
