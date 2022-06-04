
const Contact = require('../models/contactos')
const User=require('../models/usuarios')

const existeRuc= async(ruc)=>{
    const existeUser=await User.findOne({where:{ruc:ruc}})
    if(existeUser){
        throw new Error(`ruc: ${ruc} already exists`)
    }
}
const noExisteRuc= async(ruc)=>{
    const noExisteUser=await User.findOne({where:{ruc:ruc}})
    if(!noExisteUser){
        throw new Error(`ruc: ${ruc} doesnt exist`)
    }
}

const noExisteEmail= async(email)=>{
    const noExisteEmail=await User.findOne({where:{email:email}})
    if(!noExisteEmail){
        throw new Error(`email: ${email} doesnt exist`)
    }
}
const existeEmail= async(email)=>{
    const existeEmail=await User.findOne({where:{email:email}})
    if(existeEmail){
        throw new Error(`email: ${email} already exists`)
    }
}

const noExisteID= async(id)=>{
    const noExisteID=await User.findOne({where:{uuid:id}})
    if(!noExisteID){
        throw new Error(`id: ${id} doesnt exist`)
    }
}
const noExisteIDContacto= async(id_c)=>{
    const noExisteIDContacto=await Contact.findOne({where:{uuid:id_c}})
    if(!noExisteIDContacto){
        throw new Error(`id: ${id_c} doesnt exist`)
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