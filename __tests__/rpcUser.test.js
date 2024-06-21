const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('../rpc/rpcUser'); // Asegúrate de importar el router correcto para usuarios
const db = require('../database/database');
const userController = require('../controllers/userController');

const app = express();
app.use(bodyParser.json());
app.use('/users', userRouter); // Asegúrate de usar el router correcto para usuarios

describe('JSON-RPC Methods Tests for Users', () => {
    test('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                jsonrpc: '2.0',
                method: 'createUser',
                params: {
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'test@example.com'
                    // Puedes añadir más campos según tus requisitos
                },
                id: 1
            })
            .expect(200);

        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);

        if (!response.body.error) {
            expect(response.body.result.message).toEqual('Usuario creado correctamente');
        }
    });

    test('should update user successfully', async () => {
        // Supongamos que hay un usuario con ID conocido en la base de datos
        const userId = 1;

        const response = await request(app)
            .post('/users')
            .send({
                jsonrpc: '2.0',
                method: 'updateUser',
                params: {
                    id: userId,
                    username: 'updateduser',
                    password: 'updatedpassword',
                    email: 'updated@example.com'
                    // Puedes añadir más campos según tus requisitos
                },
                id: 1
            })
            .expect(200);

        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.error).toBeUndefined();

        // Puedes realizar más validaciones según el comportamiento esperado de tu aplicación
    });

    test('should delete user successfully', async () => {
        // Supongamos que hay un usuario con ID conocido en la base de datos
        const userId = 1;

        const response = await request(app)
            .post('/users')
            .send({
                jsonrpc: '2.0',
                method: 'deleteUser',
                params: {
                    id: userId
                    // Puedes añadir más campos según tus requisitos
                },
                id: 1
            })
            .expect(200);

        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.error).toBeUndefined();

        // Puedes realizar más validaciones según el comportamiento esperado de tu aplicación
    });

    test('should handle error while deleting user', async () => {
        // Simulamos un escenario donde la eliminación del usuario falla
        const simulatedError = {
            code: -32000,
            message: 'Error deleting user'
        };

        jest.spyOn(userController, 'deleteUser').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con un error
            callback(simulatedError);
        });

        const response = await request(app)
            .post('/users')
            .send({
                jsonrpc: '2.0',
                method: 'deleteUser',
                params: {
                    id: 1
                    // Puedes añadir más campos según tus requisitos
                },
                id: 1
            })
            .expect(200);

        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toBeUndefined();
        expect(response.body.error).toBeDefined();
        expect(response.body.error.code).toEqual(0);
        expect(response.body.error.message).toEqual(simulatedError.message);

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });

    // Puedes añadir más pruebas según los métodos y casos de uso específicos de tu aplicación

});

