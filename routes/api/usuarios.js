const res = require('express/lib/response')
const { User } = require('../../db')
const {check}=require('express-validator')
const { crearUser, loginUser, deleteUser, forgotPassword, verificarPassword, resetPassword } = require('../../controllers/usuarios')
const { validarCampo } = require('../../middlewares/validarCampo')
const { existeRuc, noExisteRuc, noExisteEmail } = require('../../middlewares/dbValidator')
const router=require('express').Router()


// router.get('/',async(req,res)=>{
//     const users=await User.findAll({where:{status:true}})
//     res.json(users)
// })

router.post('/login',[

],loginUser)

//CREAR USER---
router.post('/',[
    check('ruc').custom(existeRuc),
    check('email','El email no es valido').isEmail(),
    check('email_r','El email no es valido').isEmail(),
    check('status','El usuario no esta disponible').isIn([true]),
    check('password','El password debe ser más de 6 letras').isLength({min:6}),
    validarCampo
],crearUser)

//RECUPERAR CONTRASEÑA---
router.get('/forgot-password',(req,res,next)=>{
    res.render('forgot-password')
})
router.post('/forgot-password',[
    check('ruc').custom(noExisteRuc),
    check('email').isEmail(),
    check('email').custom(noExisteEmail),
    validarCampo
],forgotPassword)

router.get('/reset-password/:ruc/:token',[
    check('ruc').custom(noExisteRuc),
    validarCampo
],verificarPassword)

router.post('/reset-password/:ruc/:token',[
    check('ruc').custom(noExisteRuc),
    validarCampo
],resetPassword)

router.delete('/',[
    check('ruc').custom(existeRuc),
    check('email','El email no es valido').isEmail(),
    validarCampo
],deleteUser)

module.exports=router