const User=require('../models/usuarios')
const bcrypt=require('bcryptjs')
const {templateResetear, emailResetear, templateVerificar, emailVerificar } = require("../middlewares/emailValidator")
const { v4: uuidv4 } = require('uuid');
const { customAlphabet } = require('nanoid');
const nanoid=customAlphabet('1234567890abcdefghijklmnopqrstuvwx')



const mostrarUser=async(req,res)=>{
    const token=req.header('token')
    const isAdmin=await User.findOne({where:{uuid:token,role:[0,1]}})
    if(!isAdmin){
        return res.status(401).json({msg:'permission denied'})
    }
    const user=await User.findAll({where:{role:2}})
    if(!user){
        return res.status(401).json({msg:'users not found'})
    }
    if(user){
        res.status(200).json({user})
    }
    else{
        return res.status(400).json({msg:'error'}) 
    }
}

const crearUser=async(req,res)=>{
    try {
        req.body.password=bcrypt.hashSync(req.body.password)
        req.body.uuid=uuidv4()
        const user= await User.create(req.body)
        const template= templateVerificar(user.name,user.email,user.ruc,user.company_name)
        await emailVerificar(req.body.email,template)
        res.status(200).json({status:user.status,role:user.role,id:user.uuid})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const loginUser=async(req,res)=>{
    const user=await User.findOne({where:{email:req.body.email}})
    if(!user.status){
        return res.status(401).json({msg:'usuario inactivo'})
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
    const token=nanoid(6).toLocaleUpperCase()
    await user.update({resetpass:token},{where:{ruc:ruc}})
    const template= templateResetear(user.name,token,user.email)
    await emailResetear(email,template)
    res.json({msg:'ok'})
}

const resetPassword=async(req,res)=>{
    const {password,password2,token}=req.body
    const user=await User.findOne({where:{resetpass:token}})
    if(!user){
        return res.status(400).json({msg:'token invalido'})
    }
    try {
        if(password===password2){
            const newPassword=bcrypt.hashSync(password)
            await user.update({password:newPassword},{where:{resetpass:token}})
            res.status(200).json({msg:'clave cambiada'})
        }else{
            return res.status(401).json({msg:'las claves son distintas'})
        }
    } catch (error) {
        res.status(400).json({msg:'token invalido'})
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
    mostrarUser,
    crearUser,
    loginUser,
    deleteUser,
    forgotPassword,
    resetPassword
}