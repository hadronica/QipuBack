const { User } = require("../db")
const bcrypt=require('bcryptjs')
const {emailVerificar, templateVerificar, templateResetear, emailResetear } = require("../middlewares/emailValidator")
const { generarJWT, generarJWTLink, verifyJWT } = require("../helpers/generarJWT")

const key=process.env.SECRETORPRIVATEKEY

const crearUser=async(req,res)=>{
    try {
        req.body.password=bcrypt.hashSync(req.body.password)
        const user= await User.create(req.body)
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const loginUser=async(req,res)=>{
    const user=await User.findOne({where:{email:req.body.email,status:true}})
    if(user){

    }else{
        res.status(401).json({msg:'Error en usuario/contraseña'})
    }
}
const forgotPassword=async(req,res)=>{
    const {email,ruc}=req.body
    const token=generarJWTLink(ruc,email)
    const link=`http://localhost:8080/api/usuarios/reset-password/${ruc}/${token}`
    const template=templateResetear(ruc,link)
    await emailResetear(email,template)
    res.json({msg:'ok'})
}

const verificarPassword=async(req,res)=>{
    const {ruc,token}=req.params
    
    try {
        verifyJWT(token,key)
        res.render('reset-password',{ruc:ruc})
    } catch (error) {
        res.json({error})
    }
}
//
const resetPassword=async(req,res)=>{
    const {ruc,token}=req.params
    const {password,password2}=req.body
    try {
        if(password===password2){
            const newPassport=bcrypt.hashSync(password)
            await User.update({password:newPassport},{where:{ruc:ruc}})
            res.json({msg:'todo ok'})
        }
    } catch (error) {
        res.status(400).json({msg:'mal token'})
    }
}

const deleteUser=async(req,res)=>{
    const user=await User.findByPk(req.body.ruc)
    try {
        verifyJWT(token,key)
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
    verificarPassword,
    resetPassword
}