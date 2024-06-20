const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../controllers/userController');
const routerRCP = require('../rpc/router'); // Asegúrate de ajustar la ruta según donde se encuentre tu archivo router.js

const app = express();
app.use(bodyParser.json());
app.use('/users', routerRCP); // Montar el router en la ruta /users

describe('User Routes Tests', () => {
  // Prueba para la ruta POST /users/create
   /*test('POST /users/create - Create User', async () => {
    const userData = { username: 'prueba1', password: 'testpass', role: 'user' };

    const response = await request(app)
      .post('/users/create')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Usuario creado correctamente');
  });*/

  test('Error Handling - Server Error', async () => {
    // Forzamos un error en el controlador simulando una situación incorrecta
    jest.spyOn(userController, 'createUser').mockImplementation((params, callback) => {
      callback(new Error('Simulated error'), null);
    });

    const response = await request(app)
      .post('/users/create')
      .send({ username: 'testuser', password: 'testpass', role: 'user' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Simulated error');
  });

  // Test para el caso en que el inicio de sesión sea exitoso
    it('POST /users/login - Successful Login', async () => {
        // Datos de prueba para el inicio de sesión exitoso
        const userData = {
            username: 'username',
            password: 'password123',
        };

        // Mock del método login del controlador
        userController.login = jest.fn((params, callback) => {
            // Simulación de inicio de sesión exitoso
            callback(null, { message: 'Inicio de sesión exitoso' });
        });

        // Realiza la solicitud HTTP simulada utilizando supertest
        const response = await request(app)
            .post('/users/login')
            .send(userData);

        // Verifica que la respuesta tenga un estado 200 OK
        expect(response.status).toBe(200);

        // Verifica que la respuesta contenga el mensaje esperado
        expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
    });

    // Test para la actualización de usuario exitosa
    it('POST /users/update - Update User Successful', async () => {
        // Datos de prueba para la actualización de usuario
        const userData = {
            id: 1,
            username: 'newusername',
            password: 'newpassword',
        };

        // Mock del método updateUser del controlador
        userController.updateUser = jest.fn((params, callback) => {
            // Simulación de actualización de usuario exitosa
            callback(null, { message: 'Usuario actualizado correctamente' });
        });

        // Realiza la solicitud HTTP simulada utilizando supertest
        const response = await request(app)
            .post('/users/update')
            .send(userData);

        // Verifica que la respuesta tenga un estado 200 OK
        expect(response.status).toBe(200);

        // Verifica que la respuesta contenga el mensaje esperado
        expect(response.body).toHaveProperty('message', 'Usuario actualizado correctamente');
    });

    // Test para la actualización de usuario con error
    it('POST /users/update - Update User Error', async () => {
        // Datos de prueba para la actualización de usuario que causará un error
        const userData = {
            id: 1,
            username: 'newusername',
            password: 'newpassword',
        };

        // Mock del método updateUser del controlador que simula un error
        userController.updateUser = jest.fn((params, callback) => {
            // Simulación de error en la actualización de usuario
            callback({ code: -32000, message: 'Error al actualizar usuario' });
        });

        // Realiza la solicitud HTTP simulada utilizando supertest
        const response = await request(app)
            .post('/users/update')
            .send(userData);

        // Verifica que la respuesta tenga un estado 500 (Error interno del servidor)
        expect(response.status).toBe(500);

        // Verifica que la respuesta contenga el mensaje de error esperado
        expect(response.body).toHaveProperty('error', 'Error al actualizar usuario');
    });

    // Test para eliminar usuario exitosamente
    it('POST /users/delete - Delete User Successful', async () => {
        // Datos de prueba para la eliminación de usuario
        const userData = {
            id: 1,
        };

        // Mock del método deleteUser del controlador
        userController.deleteUser = jest.fn((params, callback) => {
            // Simulación de eliminación de usuario exitosa
            callback(null, { message: 'Usuario eliminado correctamente' });
        });

        // Realiza la solicitud HTTP simulada utilizando supertest
        const response = await request(app)
            .post('/users/delete')
            .send(userData);

        // Verifica que la respuesta tenga un estado 200 OK
        expect(response.status).toBe(200);

        // Verifica que la respuesta contenga el mensaje esperado
        expect(response.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    // Test para error al eliminar usuario
    it('POST /users/delete - Delete User Error', async () => {
        // Datos de prueba para la eliminación de usuario que causará un error
        const userData = {
            id: 1,
        };

        // Mock del método deleteUser del controlador que simula un error
        userController.deleteUser = jest.fn((params, callback) => {
            // Simulación de error en la eliminación de usuario
            callback({ code: -32000, message: 'Error al eliminar usuario' });
        });

        // Realiza la solicitud HTTP simulada utilizando supertest
        const response = await request(app)
            .post('/users/delete')
            .send(userData);

        // Verifica que la respuesta tenga un estado 500 (Error interno del servidor)
        expect(response.status).toBe(500);

        // Verifica que la respuesta contenga el mensaje de error esperado
        expect(response.body).toHaveProperty('error', 'Error al eliminar usuario');
    });
});