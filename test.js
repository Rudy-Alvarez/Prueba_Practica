const db = require('./config/db');

async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  };
}

testConnection();