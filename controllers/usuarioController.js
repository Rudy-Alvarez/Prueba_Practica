const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioModel = require('../models/usuarioModel');


const login = async(req,res)=>{

    try{

        const {username,password}=req.body;


        const usuario = await usuarioModel.buscarUsuario(username);


        if(!usuario){
            return res.status(401).json({
                mensaje:"Usuario no encontrado"
            });
        }


        const passwordCorrecto = await bcrypt.compare(
            password,
            usuario.PASSWORD
        );


        if(!passwordCorrecto){

            return res.status(401).json({
                mensaje:"Contraseña incorrecta"
            });

        }


        const token = jwt.sign(
            {
                id:usuario.ID,
                username:usuario.USERNAME
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"8h"
            }
        );


        res.json({
            mensaje:"Login correcto",
            token,
            usuario:{
                nombre:usuario.NAME,
                username:usuario.USERNAME
            }
        });


    }catch(error){

        console.error(error);

        res.status(500).json({
            mensaje:"Error del servidor"
        });

    }

};

const registrar = async (req, res) => {
    try {
        const { username, password, nombre, nit, direccion, telefono } = req.body;

        if (!username || !password || !nombre || !nit || !direccion || !telefono) {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                mensaje: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        if (nit.length > 13) {
            return res.status(400).json({
                mensaje: "El NIT no puede tener más de 10 caracteres"
            });
        }

        const usuarioExistente = await usuarioModel.buscarUsuarioPorUsername(username);

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: "El usuario ya existe, elige otro"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await usuarioModel.crearUsuario({
            username,
            hashedPassword,
            nombre,
            nit,
            address: direccion,
            phone: telefono
        });

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: {
                username: nuevoUsuario.username,
                nombre: nuevoUsuario.nombre
            }
        });

    } catch (error) {
        console.error(error);

        // Si el NIT ya existe (columna UNIQUE), MySQL lanza este código
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje: "El NIT ya está registrado"
            });
        }

        res.status(500).json({
            mensaje: "Error al crear el usuario"
        });
    }
};


const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al listar los usuarios"
        });
    }
};


module.exports={
    login,
    registrar,
    listarUsuarios
};