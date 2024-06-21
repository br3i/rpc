const { Router } = require('express');
const { JSONRPCServer } = require('json-rpc-2.0');
const ingredientController = require('../controllers/ingredientsController');

const server = new JSONRPCServer();

server.addMethod('createIngredient', (params) => {
    return new Promise((resolve, reject) => {
        ingredientController.createIngredient(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

server.addMethod('readIngredient', (params) => {
    return new Promise((resolve, reject) => {
        ingredientController.readIngredient(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

server.addMethod('updateIngredient', (params) => {
    return new Promise((resolve, reject) => {
        ingredientController.updateIngredient(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

server.addMethod('deleteIngredient', (params) => {
    return new Promise((resolve, reject) => {
        ingredientController.deleteIngredient(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

const router = Router();
router.use((req, res) => {
    const jsonRPCRequest = req.body;
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = router;
