const fs=require('fs')
const {check}=require('express-validator')
const { validarCampo } = require('../../middlewares/validarCampo')
const User=require('../../models/usuarios')


const router=require('express').Router()

router.post('/ruc',[
    check('ruc','El ruc debe ser de 11 digitos').isLength({min:11,max:11}),
    validarCampo
],async(req,res)=>{
    const ruc=req.body.ruc
    const existeUser=await User.findOne({where:{ruc:ruc}})
    if(existeUser){
        return res.status(401).json({validate:false,msg:`El ruc ${ruc} ya existe`})
    }else{
        return res.status(200).json({validate:true})
    }
 
})
router.post('/email',[
    check('email','El email es invalido').isEmail(),
    validarCampo
],async(req,res)=>{
    const email=req.body.email
    const existeUser=await User.findOne({where:{email:email}})
    if(existeUser){
        return res.status(401).json({validate:false,msg:`El email ${email} ya existe`})
    }else{
        return res.status(200).json({validate:true})
    }
 
})

router.post('/token',async(req,res)=>{
    const {token}=req.body
    const user=await User.findOne({where:{resetpass:token}})
    if(!user){
        return res.status(400).json({msg:'token invalido'})
    }else{
        res.status(200).json({validate:true})
    }
})

router.post('/ruc_verify',async(req,res)=>{
    const {ruc}=req.body
    const rucs=JSON.parse(fs.readFileSync('./ruc.json', 'utf8'))
    const validatedRuc=rucs.some(i=>i.RUC==ruc)
    if(!validatedRuc){
        return res.status(401).json({validate:false})
    }
    return res.status(200).json({validate:true})
})

module.exports=router

