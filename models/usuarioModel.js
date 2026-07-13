const db = require('../config/db');

const buscarUsuario = async (username) => {
    const [rows] = await db.query(`
        SELECT 
        ua.ID,
        ua.USERNAME,
        ua.PASSWORD
        FROM PersonAccount ua
        INNER JOIN Person p ON ua.PERSON_ID = p.ID
        WHERE ua.USERNAME = ?
    `, [username]);
    return rows[0];
};

const buscarUsuarioPorUsername = async (username) => {
    const [rows] = await db.query(
        `SELECT ID FROM PersonAccount WHERE USERNAME = ?`,
        [username]
    );
    return rows[0];
};

const crearUsuario = async ({ username, hashedPassword, nombre, nit = null, address = null, phone = null }) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Generar el siguiente ID disponible para Person (no es auto_increment)
        const [maxRows] = await connection.query(
            `SELECT COALESCE(MAX(ID), 0) + 1 AS nextId FROM Person`
        );
        const personId = maxRows[0].nextId;

        // 2. Crear el registro en Person
        await connection.query(
            `INSERT INTO Person (ID, NIT, NAME, ADDRESS, PHONE_NUMBER) VALUES (?, ?, ?, ?, ?)`,
            [personId, nit, nombre, address, phone]
        );

        // 3. Crear el registro en PersonAccount (ID sí es auto_increment)
        const [result] = await connection.query(
            `INSERT INTO PersonAccount (PERSON_ID, USERNAME, PASSWORD) VALUES (?, ?, ?)`,
            [personId, username, hashedPassword]
        );

        await connection.commit();

        return { id: result.insertId, personId, username, nombre };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


const obtenerUsuarios = async () => {
    const [rows] = await db.query(`
        SELECT 
            pa.ID,
            p.NIT,
            p.NAME AS NOMBRE,
            pa.USERNAME
        FROM PersonAccount pa
        INNER JOIN Person p ON pa.PERSON_ID = p.ID
        ORDER BY pa.ID DESC
    `);
    return rows;
};




module.exports = {
    buscarUsuario,
    buscarUsuarioPorUsername,
    crearUsuario,
    obtenerUsuarios
};