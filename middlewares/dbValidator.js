
const { User } = require("../db")

const existeRuc= async(ruc)=>{
    const existeUser=await User.findOne({where:{ruc:ruc}})
    if(existeUser){
        throw new Error(`El ruc ${ruc} ya existe`)
    }
}

const noExisteRuc= async(ruc)=>{
    const noExisteUser=await User.findOne({where:{ruc:ruc}})
    if(!noExisteUser){
        throw new Error(`El ruc ${ruc} no existe`)
    }
}

const noExisteEmail= async(email)=>{
    const noExisteEmail=await User.findOne({where:{email:email}})
    if(!noExisteEmail){
        throw new Error(`El email ${email} no existe`)
    }
}

module.exports={
    existeRuc,
    noExisteRuc,
    noExisteEmail
}