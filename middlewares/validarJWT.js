const { response } = require('express')
const jwt=require('jsonwebtoken')
const User=require('../models/usuarios')


const validarJWT=async(token)=>{
    // const token=req.header('x-token')
    if(!token){
        throw new Error('no hay token')
    }
    try{
        const {password,email}=jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        const user=await User.findOne({where:{password:password,email:email}})
        if(!user){
            throw new Error('token invalido')
        }else{
            return user.id
        }
    }catch(error){
        console.log(error)
    }
}

module.exports={
    validarJWT
}