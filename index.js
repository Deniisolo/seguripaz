const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
    host: 'dpg-csp3ku2j1k6c73cgsg90-a.oregon-postgres.render.com',
    database: 'seguripazdb',
    user: 'denisalvarez',
    password: 'fkbMzIE59PV5Hul4mRUsr5J2lJNcOjK3',
    port: 5432,
    ssl: { rejectUnauthorized: false }, // Para conexiones seguras
});

// Middleware para parsear JSON
app.use(bodyParser.json());

// Ruta GET para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).send('Error al obtener los usuarios.');
    }
});

// Ruta POST para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { cedula, nombres, celular, correo } = req.body;

    if (!cedula || !nombres || !celular || !correo) {
        return res.status(400).send('Faltan campos requeridos.');
    }

    try {
        const query = `
            INSERT INTO usuarios (cedula, nombres, celular, correo)
            VALUES ($1, $2, $3, $4)
        `;
        const values = [cedula, nombres, celular, correo];
        await pool.query(query, values);

        res.status(201).send('Usuario agregado exitosamente.');
    } catch (error) {
        console.error('Error al agregar el usuario:', error);
        res.status(500).send('Error al agregar el usuario.');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
