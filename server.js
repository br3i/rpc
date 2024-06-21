const app = require('./app');
const PORT = process.env.PORT || 3000;

let server;

function startServer() {
    if (process.env.NODE_ENV !== 'test') {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        return server;
    }
}

function stopServer() {
    if (server) {
        server.close();
    }
}

// Si se ejecuta server.js directamente, iniciar el servidor
if (require.main === module) {
    startServer();
}


module.exports = { startServer, stopServer };
