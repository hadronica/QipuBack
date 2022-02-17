
const Contact = require('../models/contactos')
const User=require('../models/usuarios')

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
const existeEmail= async(email)=>{
    const existeEmail=await User.findOne({where:{email:email}})
    if(existeEmail){
        throw new Error(`El email ${email} ya existe`)
    }
}

const noExisteID= async(id)=>{
    const noExisteID=await User.findOne({where:{uuid:id}})
    if(!noExisteID){
        throw new Error(`El id ${id} no existe`)
    }
}
const noExisteIDContacto= async(id_c)=>{
    const noExisteIDContacto=await Contact.findOne({where:{uuid:id_c}})
    if(!noExisteIDContacto){
        throw new Error(`El id ${id_c} no existe`)
    }
}

module.exports={
    existeRuc,
    noExisteRuc,
    noExisteEmail,
    existeEmail,
    noExisteID,
    noExisteIDContacto,
}