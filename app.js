const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors({
    origin: 'http://localhost:3000', // Reemplaza con la URL de tu frontend
}))

app.use(express.json());



const usuarioRoutes = require('./routes/usuarioRoute');

app.use('/', usuarioRoutes);
const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});