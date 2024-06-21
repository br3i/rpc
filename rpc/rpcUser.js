const { Router } = require('express');
const { JSONRPCServer } = require('json-rpc-2.0');
const userController = require('../controllers/userController');

const server = new JSONRPCServer();

server.addMethod('createUser', (params) => {
    return new Promise((resolve, reject) => {
        userController.createUser(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

server.addMethod('login', (params) => {
    return new Promise((resolve, reject) => {
        userController.login(params, (err, result) => {
            if (err) {
                reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});


server.addMethod('updateUser', (params) => {
    return new Promise((resolve, reject) => {
        userController.updateUser(params, (err, result) => {
            if (err) {
                return reject({ code: err.code, message: err.message });
            }
            resolve(result);
        });
    });
});

server.addMethod('deleteUser', (params) => {
    return new Promise((resolve, reject) => {
        userController.deleteUser(params, (err, result) => {
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
