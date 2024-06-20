const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const ingredientRoutes = require('./routes/ingredient.js');
const userRoutes = require("./routes/users.js");
const rpcRoutes = require('./rpc/router'); // Importa el router JSON-RPC
const { db, getAllData } = require('./database/database.js'); // Configuración de base de datos
const path = require('path'); // Módulo para trabajar con rutas de archivos

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/ingredients', ingredientRoutes); // Rutas de ingredientes
app.use('/users', userRoutes);
app.use('/rpc', rpcRoutes); // Ruta para JSON-RPC

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para visualizar la base de datos
app.get('/database', (req, res) => {
    const { getAllData } = require('./models/User');
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

// Ruta principal (opcional si tienes un index.html en 'public')
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
