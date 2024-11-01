const TABLA = 'usuarios';
const auth = require('../auth');
const bcrypt = require('bcrypt');

module.exports = function(dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function uno(id) {
        return db.uno(TABLA, id);
    }

    
    async function agregar(body) {
        const usuario = {
            nombre: body.nombre,
            apellido: body.apellido,
            nombreUsuario: body.nombreUsuario,
            contraseña: body.contraseña,
            estado: body.estado,
            rol: body.rol
        };

    
        const respuesta = await db.agregar(TABLA, usuario);
        const insertId = respuesta.insertId;

    
        const authData = {
            id: insertId,
            usuario: body.nombreUsuario,
            contraseña: body.contraseña
        };
        await auth.agregar(authData);

        return respuesta;
    }

    
    async function actualizar(id, body) {
        const usuario = {
            nombre: body.nombre,
            apellido: body.apellido,
            nombreUsuario: body.nombreUsuario,
            estado: body.estado,
            rol: body.rol
        };

        
        await db.actualizar(TABLA, id, usuario);

        
        if (body.nombreUsuario || body.contraseña) {
            const authData = {
                usuario: body.nombreUsuario
            };

            if (body.contraseña) {
                authData.contraseña = await bcrypt.hash(body.contraseña.toString(), 2);  // Hashear la nueva contraseña
            }

            await db.actualizar('auth', id, authData);
        }

        return { mensaje: 'Usuario actualizado correctamente' };
    }

    async function eliminar(body) {
        const idUsuario = body.id;

        
        await db.eliminar('auth', idUsuario);

        
        return db.eliminar(TABLA, idUsuario);
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
    };
};