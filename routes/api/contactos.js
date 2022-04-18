const { check } = require('express-validator')
const { crearContacto, listarContacto, listarContactos, modificarContacto, eliminarContacto, listarContactosUserAdmin, listarContactosName, listarContactosporUser } = require('../../controllers/contactos')
const { noExisteID, noExisteIDContacto } = require('../../middlewares/dbValidator')
const { validarCampo } = require('../../middlewares/validarCampo')

const router=require('express').Router()

router.post('/namesuser',listarContactosporUser)
//CREAR CONTACTO
router.post('/:id',[
    check('id','id invalido').not().isEmpty(),
    check('id').custom(noExisteID),
    check('email','el email no es valido').isEmail(),
    check('ruc','El ruc debe ser de 11 digitos').isLength({min:11,max:11}),
    check('email_extra','el email no es valido').isEmail(),
    check('full_name','el nombre es obligatorio').not().isEmpty(),
    check('name_debtor','el nombre es obligatorio').not().isEmpty(),
    validarCampo
],crearContacto)

//LISTAR CONTACTOS
router.get('/pagadores-admin',listarContactosUserAdmin)
router.get('/names',listarContactosName)

router.get('/pagadores',listarContactos)

router.get('/pagador/:id/:id_c',[
    check('id','id invalido').not().isEmpty(),
    check('id_c','id invalido').not().isEmpty(),
    check('id').custom(noExisteID),
    check('id_c').custom(noExisteIDContacto),
    validarCampo
],listarContacto)

//MODIFICAR CONTACTO
router.post('/:id/:id_c',[
    check('id','id invalido').not().isEmpty(),
    check('id_c','id invalido').not().isEmpty(),
    check('id').custom(noExisteID),
    check('id_c').custom(noExisteIDContacto),
    validarCampo
],modificarContacto)

//ELIMINAR CONTACTO
router.delete('/:id/:id_c',[
    check('id','id invalido').not().isEmpty(),
    check('id_c','id invalido').not().isEmpty(),
    check('id').custom(noExisteID),
    check('id_c').custom(noExisteIDContacto),
    validarCampo
],eliminarContacto)

module.exports=router