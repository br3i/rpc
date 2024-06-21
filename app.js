const express = require('express');
const bodyParser = require('body-parser');
const rpcUser = require('./rpc/rpcUser.js');
const rpcIng = require('./rpc/rpcIngr.js');
const { getAllData } = require('./models/User.js'); // Asegúrate de que la ruta sea correcta
const path = require('path'); // Módulo para trabajar con rutas de archivos

const app = express();

app.use(bodyParser.json());

// Rutas JSON-RPC
app.use('/rpcUser', rpcUser);
app.use('/rpcIng', rpcIng); // Agrega la nueva ruta JSON-RPC para ingredientes

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para verificar que el servidor está corriendo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para visualizar la base de datos
app.get('/database', (req, res) => {
    getAllData((err, data) => {
        if (err) {
            console.error('Error al obtener datos de la base de datos:', err);
            res.status(500).json({ error: 'Error al obtener los datos de la base de datos' });
        } else {
            console.log('Datos obtenidos de la base de datos:', data);
            res.json(data);
        }
    });
});
module.exports = app; // Exporta la aplicación express
