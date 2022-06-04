const {check}=require('express-validator')
const { crearUser, loginUser, forgotPassword, resetPassword, mostrarUsers,mostrarUser, emailUser,editUser, mostrarUsersNameToken, crearUserAdmin, asignarOperador, mostrarOperadores, mostrarUsersOperador, editOperator, deleteOperator, mostrarUsersNameTokenOperador, crearUserOperator, deleteUser } = require('../../controllers/usuarios')
const { validarCampo } = require('../../middlewares/validarCampo')
const { existeRuc, noExisteRuc, noExisteEmail, existeEmail } = require('../../middlewares/dbValidator')
const router=require('express').Router()



router.put('/edit',editUser)
//MOSTRAR USERS ADMIN--
router.post('/listusers',mostrarUsers)
//MOSTRAR USER LOGIN--
router.post('/getuser',mostrarUser)
router.get('/getoperator',mostrarUsersOperador)

router.get('/nametoken',mostrarUsersNameToken)
router.get('/nametoken-operator',mostrarUsersNameTokenOperador)

router.get('/listoperators',mostrarOperadores)

//LOGEAR USER---
router.post('/login',[
    check('email','El email no es valido').isEmail(),
    check('email').custom(noExisteEmail),
    validarCampo
],loginUser)

//CREAR USER---
router.post('/sign-in-admin',[
    check('email','El email no es valido').isEmail(),
    check('email').custom(existeEmail),
    validarCampo
],crearUserAdmin)

router.put('/asign-users',asignarOperador)
router.put('/edit-operator',editOperator)
router.put('/deleteoperator',deleteOperator)
router.put('/deleteuser',deleteUser)

router.post('/sign-in',[
    check('ruc').custom(existeRuc),
    check('ruc','El ruc es obligatorio').not().isEmpty(),
    check('ruc','El ruc debe ser de 11 digitos').isLength({min:11,max:11}),
    check('email','El email no es valido').isEmail(),
    check('email').custom(existeEmail),
    check('email_r','El email no es valido').isEmail(),
    validarCampo
],crearUser)

router.post('/sign-in-operator',[
    check('ruc').custom(existeRuc),
    check('ruc','El ruc es obligatorio').not().isEmpty(),
    check('ruc','El ruc debe ser de 11 digitos').isLength({min:11,max:11}),
    check('email','El email no es valido').isEmail(),
    check('email').custom(existeEmail),
    check('email_r','El email no es valido').isEmail(),
    validarCampo
],crearUserOperator)

//RECUPERAR CONTRASEÑA---
router.post('/forgot-password',[
    check('ruc').custom(noExisteRuc),
    check('email').isEmail(),
    check('email').custom(noExisteEmail),
    validarCampo
],forgotPassword)

router.post('/reset-password',[
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password2','La contraseña es obligatoria').not().isEmpty(),
    validarCampo
],resetPassword)

router.post('/emailsender',[
    check('email').custom(noExisteEmail)
],emailUser)




module.exports=router