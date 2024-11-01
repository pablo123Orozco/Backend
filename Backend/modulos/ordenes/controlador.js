const TABLA = 'ordenesservicio';

module.exports = function (dbinyectada) {
    let db = dbinyectada;
    if (!db) {
        db = require('../../src/DB/mysql');
    }

    async function todos() {
        return db.todos(TABLA);
    }

    async function uno(id) {
        return db.uno2(TABLA, id);
    }

    async function agregar(body) {
        console.log('Request body:', body);  
    
        const idMecanico = parseInt(body.idMecanico, 10);
        const idServicio = parseInt(body.idServicio, 10);
    
        if (isNaN(idMecanico)) {
            console.error('ID de mecánico inválido:', body.idMecanico);
            throw new Error('El ID del mecánico no es válido: ' + body.idMecanico);
        }
    
        if (isNaN(idServicio)) {
            console.error('ID de servicio inválido:', body.idServicio);
            throw new Error('El ID del servicio no es válido: ' + body.idServicio);
        }
    
        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo,
            idCliente: body.idCliente,
            idMecanico: idMecanico,  
            concepto: body.concepto,
            combustible: body.combustible,
            servicio_id: idServicio,  
            fechaIngreso: body.fechaIngreso || new Date(),  
            tipoPago: body.tipoPago,
            estadoPago: body.estadoPago,
            adelantoEmpresa: body.adelantoEmpresa || 0
        };
    
        try {
            return await db.agregar(TABLA, orden);
        } catch (error) {
            console.error('[error en agregar()]', error);
            throw error;
        }
    }

    async function actualizar(id, body) {
        const idMecanico = parseInt(body.idMecanico, 10);
        const idServicio = parseInt(body.idServicio, 10);  

        if (isNaN(idMecanico) || isNaN(idServicio)) {
            throw new Error('El ID del mecánico o del servicio no es válido');
        }

        const orden = {
            detalleReparacion: body.detalleReparacion,
            costoEstimado: body.costoEstimado,
            estado: body.estado,
            idVehiculo: body.idVehiculo,
            idCliente: body.idCliente,
            idMecanico: idMecanico,
            concepto: body.concepto,
            combustible: body.combustible,
            servicio_id: idServicio,
            fechaIngreso: body.fechaIngreso,  
            tipoPago: body.tipoPago,  
            estadoPago: body.estadoPago,
            adelantoEmpresa: body.adelantoEmpresa  
        };

        const resultado = await db.actualizar(TABLA, id, orden);

        // Comentado para evitar error por referencia no definida
        // if (body.estadoPago === 'Pagado') {
        //     await cajaControlador.registrarIngreso(id, body.costoEstimado, 'Pago por orden de servicio');
        // }

        return resultado;
    }

    async function eliminar(id) {
        return db.eliminar(TABLA, id);
    }

    return {
        uno,
        todos,
        agregar,
        actualizar,
        eliminar
    };
};