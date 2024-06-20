const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const rpcRoutes = require('../rpc/router');
const db = require('../database/database');

// Mock de la base de datos
jest.mock('../database/database');

const app = express();
app.use(bodyParser.json());
app.use('/rpc', rpcRoutes);

describe('RPC Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /rpc/create should create a new user', (done) => {
    db.get.mockImplementation((query, params, callback) => {
      callback(null, null);
    });
    db.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    request(app)
      .post('/rpc/create')
      .send({ username: 'newuser', password: 'newpass', role: 'user' })
      .expect(200)
      .then(response => {
        expect(response.body.message).toEqual('Usuario creado correctamente');
        done();
      })
      .catch(err => done(err));
  });

  test('POST /rpc/login should fail with incorrect credentials', (done) => {
    db.get.mockImplementation((query, params, callback) => {
       callback({ code: -32001, message: 'Usuario o contraseña incorrectos'}); // Simula credenciales incorrectas
    });

    request(app)
      .post('/rpc/login')
      .send({ username: 'testuser', password: 'wrongpass' })
      .expect(500)
      .then(response => {
        expect(response.body.error).toEqual('Usuario no encontrado');
        done();
      })
      .catch(err => done(err));
  });

  // Puedes agregar más pruebas de integración para update y delete
});
