const express = require('express');
const respuesta = require('../../src/red/respuesta');
const controlador = require('./index');

const router = express.Router();


router.get('/', todos);                 
router.get('/:id', uno);               
router.post('/', agregar);             
router.put('/:id', actualizar);        
router.delete('/:id', eliminar);       


async function todos(req, res, next) {
    try {
        const compras = await controlador.todos();
        respuesta.success(req, res, compras, 200);
    } catch (err) {
        next(err);
    }
}

async function uno(req, res, next) {
    try {
        const compra = await controlador.uno(req.params.id);
        respuesta.success(req, res, compra, 200);
    } catch (err) {
        next(err);
    }
}

async function agregar(req, res, next) {
    try {
        const nuevaCompra = await controlador.agregar(req.body);  
        respuesta.success(req, res, 'Compra creada con éxito', 201);
    } catch (err) {
        next(err);
    }
}

async function actualizar(req, res, next) {
    try {
        const compraActualizada = await controlador.actualizar(req.params.id, req.body);
        respuesta.success(req, res, 'Compra actualizada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

async function eliminar(req, res, next) {
    try {
        await controlador.eliminar(req.params.id);
        respuesta.success(req, res, 'Compra eliminada con éxito', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;