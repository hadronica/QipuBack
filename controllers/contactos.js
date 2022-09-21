const User=require('../models/usuarios')
const Contact=require('../models/contactos')
const Operator=require('../models/operadores')
const { nanoid } = require('nanoid')
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const crearContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        req.body.userId=user.id
        req.body.uuid=nanoid(10)
        const contact= await Contact.create(req.body)
        return res.status(200).json({status:contact.status})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const listarContactos=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const{search}=req.query
        const pagadores=await Contact.findAll({order:[['full_name','ASC']],
        where:{userId:user.id,[Op.or]:[{full_name:{[Op.like]:`%${search}%`}},{name_debtor:{[Op.like]:`%${search}%`}}]}})
        if(!pagadores){
            return res.status(401).json({msg:'contacts not found'})
        }
        return res.status(200).json(pagadores)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const listarContactosporUser=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const user= await User.findOne({where:{uuid:req.body.id}})
        if(!user){
            return res.status(401).json({msg:'client not found'})
        }
        const contacts= await Contact.findAll({order:[['full_name','ASC']],where:{userId:user.id}})
        const pagadores=contacts.map(item=>{
            return {
                name:item.full_name
            }
        })
        return res.status(200).json(pagadores)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const listarContactosName=async(req,res)=>{
try {
    const user=await User.findOne({where:{uuid:req.headers.token}})
    const pagadores=await Contact.findAll({order:[['full_name','ASC']],where:{userId:user.id}})
    const newPagadores=pagadores.map((item)=>{
        return {
            name:item.full_name,
            value:item.full_name
        }
    })
    return res.status(200).json(newPagadores)
} catch (error) {
    return res.status(400).json(error)
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
        return res.status(400).json(error)
    }
}
const listarContactosUserAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const {search}=req.query
        const contacts=await User.findAll({
            include:[Contact],where:{role:2,[Op.or]:[{company_name:{[Op.like]:`%${search}%`}}]},
            order:[['company_name','ASC'],[Contact,'full_name','ASC']],
        })
        const usercontact=contacts.map((item)=>{
            return {
                id:item.uuid,
                name:item.name,
                company_name:item.company_name,
                contacts:item.contacts.map(i=>{
                    return {
                        id:i.uuid,
                        ruc:i.ruc,
                        full_name:i.full_name,
                        email:i.email,
                        email_extra:i.email_extra,
                        phone:i.phone,
                        name_debt:i.name_debt,
                        status:i.status,
                        createdAt:i.createdAt,
                        updatedAt:i.updatedAt,
                    }
                })
            }
        })
        return res.status(200).json(usercontact)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const listarContactosUserOperator=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:1}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const {search}=req.query
        const operator=await Operator.findOne({where:{uuid:isAdmin.uuid}})
        const contacts=await User.findAll({include:[Contact],
            where:{operatorId:operator.id,[Op.or]:[{company_name:{[Op.like]:`%${search}%`}}]},
            order:[['company_name','ASC'],[Contact,'full_name','ASC']]
        })
        const usercontact=contacts.map((item)=>{
            return {
                id:item.uuid,
                name:item.name,
                company_name:item.company_name,
                contacts:item.contacts.map(i=>{
                    return {
                        id:i.uuid,
                        ruc:i.ruc,
                        full_name:i.full_name,
                        email:i.email,
                        email_extra:i.email_extra,
                        phone:i.phone,
                        name_debt:i.name_debt,
                        status:i.status,
                        createdAt:i.createdAt,
                        updatedAt:i.updatedAt,
                    }
                })
            }
        })
        return res.status(200).json(usercontact)
    } catch (error) {
        return res.status(400).json(error)
    }
}
const listarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const pagador=await Contact.findOne({where:{userId:user.id,uuid:req.body.id}})
        return res.status(200).json({pagador})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const modificarContacto=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const contacto=await Contact.findOne({where:{uuid:req.body.id}})
        await Contact.update(req.body,{where:{contact_id:contacto.contact_id}})
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const eliminarContacto=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const contacto=await Contact.findOne({where:{userId:user.id,uuid:req.body.id}})
        contacto.destroy()
        return res.status(200).json({msg:'deleted successfully'})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

module.exports={
    crearContacto,
    listarContactos,
    listarContactosName,
    listarContacto,
    listarContactosAdmin,
    listarContactosUserAdmin,
    listarContactosporUser,
    modificarContacto,
    eliminarContacto,
    listarContactosUserOperator
}