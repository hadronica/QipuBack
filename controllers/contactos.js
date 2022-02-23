const User=require('../models/usuarios')
const Contact=require('../models/contactos')
const { nanoid } = require('nanoid')

const crearContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        req.body.userId=user.id
        req.body.uuid=nanoid(10)
        const contact= await Contact.create(req.body)
        res.status(200).json({status:contact.status})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const listarContactos=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        const contactos=await Contact.findAll({where:{userId:user.id}})
        res.status(200).json({contacts})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const listarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        const contacto=await Contact.findOne({where:{userId:user.id,uuid:req.params.id_c}})
        res.status(200).json({contacto})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const modificarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        const contacto=await Contact.findOne({where:{userId:user.id,uuid:req.params.id_c}})
        const newContacto =await Contact.update(req.body,{where:{contact_id:contacto.contact_id}})
        res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const eliminarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        const contacto=await Contact.findOne({where:{userId:user.id,uuid:req.params.id_c}})
        contacto.destroy()
        res.status(200).json({msg:'deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

module.exports={
    crearContacto,
    listarContactos,
    listarContacto,
    modificarContacto,
    eliminarContacto
}