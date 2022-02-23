const {check}=require('express-validator')
const { crearUser, loginUser, deleteUser, forgotPassword, resetPassword } = require('../../controllers/usuarios')
const { validarCampo } = require('../../middlewares/validarCampo')
const { existeRuc, noExisteRuc, noExisteEmail, existeEmail } = require('../../middlewares/dbValidator')
const { validarJWT } = require('../../middlewares/validarJWT')
const router=require('express').Router()

//LOGEAR USER---
router.post('/login',[
    check('email','El email no es valido').isEmail(),
    check('email').custom(noExisteEmail),
    validarCampo
],loginUser)

//CREAR USER---
router.post('/sign-in',[
    check('ruc').custom(existeRuc),
    check('ruc','El ruc es obligatorio').not().isEmpty(),
    check('ruc','El ruc debe ser de 11 digitos').isLength({min:11,max:11}),
    check('email','El email no es valido').isEmail(),
    check('email').custom(existeEmail),
    check('email_r','El email no es valido').isEmail(),
    check('password','El password debe ser más de 6 letras').isLength({min:6}),
    validarCampo
],crearUser)

//RECUPERAR CONTRASEÑA---
router.post('/forgot-password',[
    check('ruc').custom(noExisteRuc),
    check('email').isEmail(),
    check('email').custom(noExisteEmail),
    validarCampo
],forgotPassword)

router.post('/reset-password/:token',[
    check('password','El password debe ser más de 6 letras').isLength({min:6}),
    check('password2','El password debe ser más de 6 letras').isLength({min:6}),
    check('password','La contraseña es obligatoria').not().isEmpty(),
    check('password2','La contraseña es obligatoria').not().isEmpty(),
    validarCampo
],resetPassword)

// router.delete('/',[
//     check('ruc').custom(existeRuc),
//     check('email','El email no es valido').isEmail(),
//     validarCampo
// ],deleteUser)

module.exports=router