const User=require('../models/usuarios')


const validarJWTAdmin=async(token)=>{
    const uuid=req.header('token')
    if(!uuid){
        throw new Error('invalid token')
    }
    try{
        const user=await User.findOne({where:{uuid:uuid}})
        if(!user){
            throw new Error('invalid token')
        }
    }catch(error){
        console.log(error)
    }
}

module.exports={
    validarJWTAdmin
}