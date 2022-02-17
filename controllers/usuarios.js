const User=require('../models/usuarios')
const bcrypt=require('bcryptjs')
const {templateResetear, emailResetear } = require("../middlewares/emailValidator")
const { generarJWT, generarJWTLink } = require("../helpers/generarJWT");
const { v4: uuidv4 } = require('uuid');
const { validarJWT } = require('../middlewares/validarJWT');


const crearUser=async(req,res)=>{
    try {
        req.body.password=bcrypt.hashSync(req.body.password)
        req.body.uuid=uuidv4()
        const user= await User.create(req.body)
        res.status(200).json({status:user.status,role:user.role,id:user.uuid})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const loginUser=async(req,res)=>{
    const user=await User.findOne({where:{email:req.body.email}})
    if(!user.status){
        return res.status(401).json({msg:'usuario denegado'})
    }
    if(user){
        const igualar=bcrypt.compareSync(req.body.password,user.password)
        if (igualar) {
            res.status(200).json({status:user.status,role:user.role,id:user.uuid})
        } else {
            return res.status(401).json({msg:'Error en contraseña'})
        }
    }else{
        return res.status(401).json({msg:'Error en email'})
    }
}
const forgotPassword=async(req,res)=>{
    const {email,ruc}=req.body
    const user= await User.findOne({where:{ruc:ruc,email:email}})
    const token=await generarJWTLink(user.password,email)
    const link=`http://localhost:8080/api/usuarios/reset-password/${token}`
    const template=await templateResetear(user.name,link)
    await emailResetear(email,template)
    res.json({msg:token})
}

const resetPassword=async(req,res)=>{
    const {token}=req.params
    const {password,password2}=req.body
    try {
        const id=await validarJWT(token)
        if(password===password2){
            const newPassword=bcrypt.hashSync(password)
            await User.update({password:newPassword},{where:{id:id}})
            res.json({msg:'clave cambiada'})
        }else{
            return res.status(401).json({msg:'las claves son distintas'})
        }
    } catch (error) {
        res.status(400).json({msg:'mal token'})
    }
}

const deleteUser=async(req,res)=>{
    const user=await User.findByPk(req.body.ruc)
    try {
        await User.update({status:false},{where:{ruc:req.params.ruc,email:req.params.email}})
        res.json(user)
    } catch (error) {
        res.json(error)
    }
}

module.exports={
    crearUser,
    loginUser,
    deleteUser,
    forgotPassword,
    resetPassword
}