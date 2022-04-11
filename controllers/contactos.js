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
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const pagadores=await Contact.findAll({where:{userId:user.id}})
        res.status(200).json({pagadores})
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const listarContactosName=async(req,res)=>{
try {
    const user=await User.findOne({where:{uuid:req.headers.token}})
    const pagadores=await Contact.findAll({where:{userId:user.id}})
    const newPagadores=pagadores.map((item)=>{
        return {
            name:item.name_debtor,
            value:item.name_debtor
        }
    })
    res.status(200).json(newPagadores)
} catch (error) {
    res.status(400).json(error)
}
}

const listarContactosAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const users=await User.findAll()
        const contacts=await Contact.findAll()
        
        return res.status(200).json({users,contacts})
    } catch (error) {
        res.status(400).json(error)
    }
}
const listarContactosUserAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const contacts=await User.findAll({where:{role:2},include:[Contact]})
        const usercontact=contacts.map((item)=>{
            return {
                id:item.id,
                name:item.name,
                company_name:item.company_name,
                contacts:item.contacts
            }
        })
        return res.status(200).json(usercontact)
    } catch (error) {
        res.status(400).json(error)
    }
}

const listarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.params.id}})
        const pagador=await Contact.findOne({where:{userId:user.id,uuid:req.params.id_c}})
        res.status(200).json({pagador})
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
    listarContactosName,
    listarContacto,
    listarContactosAdmin,
    listarContactosUserAdmin,
    modificarContacto,
    eliminarContacto
}