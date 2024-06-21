const request = require('supertest');
const app = require('../app'); // Importa la aplicación express configurada
const db = require('../database/database');
const userController = require('../controllers/userController');
const userModel = require('../models/User');
const { startServer, stopServer } = require('../server');
const fs = require('fs').promises;
const path = require('path'); // Módulo para trabajar con rutas de archivos

jest.mock('../database/database'); // Mock de la base de datos

beforeAll(() => {
    startServer();
});

afterAll(() => {
    stopServer();
});


describe('RPC Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /rpcUser should create a new user', (done) => {
    const mockGetUser = jest.spyOn(db, 'get');
    mockGetUser.mockImplementation((query, params, callback) => {
      // Simulamos que el usuario no existe (retorna null)
      callback(null, null);
    });

    const mockCreateUser = jest.spyOn(userController, 'createUser');
    mockCreateUser.mockImplementation((params, callback) => {
      // Simulamos que el usuario se crea correctamente
      callback(null, { message: 'Usuario creado correctamente' });
    });

    const requestData = {
      jsonrpc: '2.0',
      method: 'createUser',
      params: {
        username: 'nuevoUsuario',
        password: 'password123',
        role: 'admin'
      },
      id: 1
    };

    request(app)
      .post('/rpcUser')
      .send(requestData)
      .expect(200)
      .then(response => {
        expect(response.body.result.message).toEqual('Usuario creado correctamente');
        done();
      })
      .catch(err => done(err));
  });

  test('POST /rpcUser should fail with incorrect login credentials', (done) => {
    const mockGetUser = jest.spyOn(db, 'get');
    mockGetUser.mockImplementation((query, params, callback) => {
      // Simulamos que no se encuentra el usuario (retorna null)
      callback(null, null);
    });

    const mockLogin = jest.spyOn(userController, 'login');
    mockLogin.mockImplementation((params, callback) => {
      // Simulamos que el login falla por credenciales incorrectas
      callback({ code: -32001, message: 'Usuario o contraseña incorrectos' });
    });

    const requestData = {
      jsonrpc: '2.0',
      method: 'login',
      params: {
        username: 'testuser',
        password: 'wrongpass'
      },
      id: 1
    };

    request(app)
      .post('/rpcUser')
      .send(requestData)
      .expect(200)
      .then(response => {
        expect(response.body.error.message).toEqual('Usuario o contraseña incorrectos');
        done();
      })
      .catch(err => done(err));
  });

  describe('Server Initialization', () => {
    let originalEnv;

    beforeAll(() => {
      // Guardar el entorno original
      originalEnv = process.env.NODE_ENV;
    });

    afterAll(() => {
      // Restaurar el entorno original
      process.env.NODE_ENV = originalEnv;
    });

    test('should not start the server if NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      const listenSpy = jest.spyOn(app, 'listen');

      // Requiere el archivo app.js de nuevo para aplicar el cambio en NODE_ENV
      jest.resetModules();
      require('../app');

      expect(listenSpy).not.toHaveBeenCalled();
    });
  });

  test('should return index.html', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    
    // Verifica que el contenido de la respuesta sea HTML
    const indexPath = path.join(__dirname, '../public/index.html');
    const expectedIndexContent = await fs.readFile(indexPath, 'utf8');
    const indexContent = response.text;

    expect(indexContent).toEqual(expectedIndexContent);
  });

});
