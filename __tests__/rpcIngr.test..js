const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const ingredientRouter = require('../rpc/rpcIngr');
const db = require('../database/database');
const ingredientController = require('../controllers/ingredientsController')

const app = express();
app.use(bodyParser.json());
app.use('/ingredients', ingredientRouter);

describe('JSON-RPC createIngredient Method', () => {
    test('should create a new ingredient', async () => {
        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'createIngredient',
                params: {
                    name: 'New Ingredient',
                    quantity: 10,
                    description: 'Test Description'
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);

        // Si no hay error, verifica el resultado
        if (!response.body.error) {
            expect(response.body.result.message).toEqual('Ingrediente creado correctamente');
        }
    });

    test('should resolve with correct message when ingredient is created', async () => {
        const ingredientParams = {
            name: 'Test4',
            quantity: 5,
            description: 'Test'
        };

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'createIngredient',
                params: ingredientParams,
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.error).toBeUndefined(); // Asegúrate de que no haya errores

        // Verifica que el resultado devuelto sea el esperado
        expect(response.body.result.message).toEqual('Ingrediente creado correctamente');

        // Aquí podrías agregar más validaciones según el comportamiento esperado de tu aplicación

        // Además, podrías realizar una verificación adicional en la base de datos para asegurarte de que el ingrediente se creó correctamente
        // Por ejemplo, puedes hacer una consulta a la base de datos para verificar que el ingrediente realmente existe

        const dbIngredient = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM ingredients WHERE name = ?', [ingredientParams.name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        expect(dbIngredient).toBeDefined();
        expect(dbIngredient.name).toEqual(ingredientParams.name);
        expect(dbIngredient.quantity).toEqual(ingredientParams.quantity);
        expect(dbIngredient.description).toEqual(ingredientParams.description);
    });

    test('should resolve with correct ingredient when found', async () => {
        // Supongamos que tienes un ingrediente en tu base de datos con ID conocido
        const ingredientId = 1;

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'readIngredient',
                params: {
                    id: ingredientId
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.error).toBeUndefined(); // Asegúrate de que no haya errores

        // Verifica que el resultado devuelto sea el esperado
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toEqual(ingredientId);

        // Aquí podrías agregar más validaciones según el comportamiento esperado de tu aplicación
    });

    test('should reject with correct error code and message when ingredient read fails', async () => {
        // Simulamos un escenario donde readIngredient del controlador genera un error
        const simulatedError = {
            code: -32000,
            message: 'Error al leer ingrediente'
        };

        jest.spyOn(ingredientController, 'readIngredient').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con un error
            callback(simulatedError);
        });

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'readIngredient',
                params: {
                    id: 1
                    // Aquí podrías incluir más parámetros según tu implementación
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toBeUndefined(); // No debería haber resultado si hay un error
        expect(response.body.error).toBeDefined(); // Debe haber un error definido

        // Verifica que el error devuelto coincida con el error simulado
        expect(response.body.error.code).toEqual(0);
        expect(response.body.error.message).toEqual(simulatedError.message);

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });

    test('should update ingredient successfully', async () => {
        // Simulamos un escenario exitoso de actualización
        const updatedIngredient = {
            message: 'Ingrediente actualizado correctamente'
        };

        jest.spyOn(ingredientController, 'updateIngredient').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con el resultado de actualización
            callback(null, updatedIngredient);
        });

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'updateIngredient',
                params: {
                    id: 1,
                    name: 'Updated Ingredient',
                    quantity: 15,
                    description: 'Updated Description'
                    // Aquí podrías incluir más parámetros según tu implementación
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toEqual(updatedIngredient); // Verifica el resultado esperado

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });

    test('should handle error while updating ingredient', async () => {
        // Simulamos un escenario donde la actualización del ingrediente falla
        const simulatedError = {
            code: -32000,
            message: 'Error al actualizar ingrediente'
        };

        jest.spyOn(ingredientController, 'updateIngredient').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con un error
            callback(simulatedError);
        });

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'updateIngredient',
                params: {
                    id: 1,
                    name: 'Updated Ingredient',
                    quantity: 15,
                    description: 'Updated Description'
                    // Aquí podrías incluir más parámetros según tu implementación
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toBeUndefined(); // No debería haber resultado si hay un error
        expect(response.body.error).toBeDefined(); // Debe haber un error definido

        // Verifica que el error devuelto coincida con el error simulado
        expect(response.body.error.code).toEqual(0);
        expect(response.body.error.message).toEqual(simulatedError.message);

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });

    test('should delete ingredient successfully', async () => {
        // Simulamos un escenario exitoso de eliminación
        const deletedIngredient = {
            message: 'Ingrediente eliminado correctamente'
        };

        jest.spyOn(ingredientController, 'deleteIngredient').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con el resultado de eliminación
            callback(null, deletedIngredient);
        });

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'deleteIngredient',
                params: {
                    id: 1
                    // Aquí podrías incluir más parámetros según tu implementación
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toEqual(deletedIngredient); // Verifica el resultado esperado

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });

    test('should handle error while deleting ingredient', async () => {
        // Simulamos un escenario donde la eliminación del ingrediente falla
        const simulatedError = {
            code: -32000,
            message: 'Error al eliminar ingrediente'
        };

        jest.spyOn(ingredientController, 'deleteIngredient').mockImplementation((params, callback) => {
            // Simulamos el llamado al callback con un error
            callback(simulatedError);
        });

        const response = await request(app)
            .post('/ingredients')
            .send({
                jsonrpc: '2.0',
                method: 'deleteIngredient',
                params: {
                    id: 1
                    // Aquí podrías incluir más parámetros según tu implementación
                },
                id: 1
            })
            .expect(200);

        // Verifica que la respuesta esté en el formato correcto de JSON-RPC
        expect(response.body.jsonrpc).toEqual('2.0');
        expect(response.body.id).toEqual(1);
        expect(response.body.result).toBeUndefined(); // No debería haber resultado si hay un error
        expect(response.body.error).toBeDefined(); // Debe haber un error definido

        // Verifica que el error devuelto coincida con el error simulado
        expect(response.body.error.code).toEqual(0);
        expect(response.body.error.message).toEqual(simulatedError.message);

        // Restauramos la implementación original del controlador después de la prueba
        jest.restoreAllMocks();
    });
});
