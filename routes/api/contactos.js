const { check } = require('express-validator')
const { crearContacto, listarContacto, listarContactos, modificarContacto, eliminarContacto, listarContactosUserAdmin, listarContactosName, listarContactosporUser, listarContactosUserOperator } = require('../../controllers/contactos')
const { noExisteID, noExisteIDContacto } = require('../../middlewares/dbValidator')
const { validarCampo } = require('../../middlewares/validarCampo')

const router=require('express').Router()

router.post('/listcontact-user',listarContactosporUser)
//CREAR CONTACTO
router.post('/create',crearContacto)
//LISTAR CONTACTOS
router.get('/listcontacts-operator',listarContactosUserOperator)
router.get('/listcontacts-admin',listarContactosUserAdmin)

router.get('/list-id',listarContacto)

router.get('/listnames',listarContactosName)

router.get('/list',listarContactos)

//MODIFICAR CONTACTO
router.put('/edit',modificarContacto)

//ELIMINAR CONTACTO
router.delete('/delete',eliminarContacto)

module.exports=router