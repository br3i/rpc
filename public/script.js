const baseUrl = 'http://localhost:3000';

// Función para realizar una solicitud JSON-RPC
const rpcRequest = async (method, params) => {
    const response = await fetch(`${baseUrl}/rpc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1
        })
    });

    return response.json();
};

// Función para autenticar usuario
const authenticate = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const userData = await response.json();
        handleSuccessfulLogin(userData); // Función para manejar el inicio de sesión exitoso
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    }
};

// Función para manejar el inicio de sesión exitoso
const handleSuccessfulLogin = (userData) => {
    document.getElementById('login').style.display = 'none';
    document.getElementById('userManagement').style.display = 'block';
    document.getElementById('inventory').style.display = 'block';
    document.querySelector('button[onclick="logout()"]').style.display = 'block';
};

// Función para mostrar los resultados
const showResult = (result) => {
    document.getElementById('result').style.display = 'block';
    document.getElementById('resultContent').textContent = JSON.stringify(result, null, 2);
};

// Función para crear un usuario a través de JSON-RPC
const createUser = async () => {
    const username = prompt('Ingrese el nombre de usuario');
    const password = prompt('Ingrese la contraseña');
    const role = prompt('Ingrese el rol');

    try {
        const result = await rpcRequest('user.create', { username, password, role });
        showResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear usuario');
    }
};

// Función para actualizar un usuario a través de JSON-RPC
const updateUser = async () => {
    const userId = prompt('Ingrese el ID del usuario a actualizar');
    const username = prompt('Ingrese el nuevo nombre de usuario');
    const password = prompt('Ingrese la nueva contraseña');

    try {
        const result = await rpcRequest('user.update', { id: userId, username, password });
        showResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al actualizar usuario');
    }
};

// Función para eliminar un usuario a través de JSON-RPC
const deleteUser = async () => {
    const userId = prompt('Ingrese el ID del usuario a eliminar');

    try {
        const result = await rpcRequest('user.delete', { id: userId });
        showResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
};

// Función para cerrar sesión
const logout = () => {
    document.getElementById('login').style.display = 'block';
    document.getElementById('userManagement').style.display = 'none';
    document.getElementById('inventory').style.display = 'none';
    document.querySelector('button[onclick="logout()"]').style.display = 'none';
    document.getElementById('result').style.display = 'none';
};
