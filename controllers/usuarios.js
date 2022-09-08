const User=require('../models/usuarios')
const Operator=require('../models/operadores')
const bcrypt=require('bcryptjs')
const {templateResetear, emailResetear, templateVerificar, emailVerificar, emailDefault, templateVerificarAdmin } = require("../middlewares/emailValidator")
const { v4: uuidv4 } = require('uuid');
const { customAlphabet } = require('nanoid');
const nanoid=customAlphabet('1234567890abcdefghijklmnopqrstuvwx')

const emailUser=async(req,res)=>{
    try {
        const token=req.header('token')
        const isAdmin=await User.findOne({where:{uuid:token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        await emailDefault(req.body.email,req.body.html,req.body.subject)
        return res.status(200).json({msg:'email sent successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}

const mostrarUser=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        if(!user){
            return res.status(401).json({msg:'users not found'})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const mostrarUsers=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        const {from,to}=req.query
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        //const user=await User.findAll({where:{role:2},limit:Number(to),offset:Number(from),subQuery:false})
        const user=await User.findAll({order:[['company_name','ASC']],where:{role:2}})
        if(!user){
            return res.status(401).json({msg:'users not found'})
        }
        const newUsers=user.map((item)=>{
            return {
                id:item.uuid,
                name:item.name,
                email:item.email,
                status:item.status,
                phone:item.phone,
                ruc:item.ruc,
                company_name:item.company_name,
                social_sector:item.social_sector,
                annual_income:item.annual_income,
                name_r:item.name_r,
                position:item.position,
                typeDocument:item.typeDocument,
                document:item.document,
                email_r:item.email_r,
                pep:item.pep,
                validity:item.validity,
                updatedAt:item.updatedAt,
                operator_name:item.operator_name
            }
        })
        return res.status(200).json(newUsers)
   } catch (error) {
       return res.status(400).json(error)
   }
}

const mostrarUsersNameToken=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const user=await User.findAll({order:[['company_name','ASC']],where:{role:2}})
        if(!user){
            return res.status(401).json({msg:'users not found'})
        }
        const newUsers=user.map((item)=>{
            return {
                id:item.uuid,
                name:item.company_name,
            }
        })
        return res.status(200).json(newUsers)
   } catch (error) {
       return res.status(400).json(error)
   }
}
const mostrarUsersNameTokenOperador=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:1}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operator=await Operator.findOne({where:{uuid:isAdmin.uuid}})
        const contacts=await User.findAll({order:[['name','ASC']],where:{operatorId:operator.id}})
        if(!contacts){
            return res.status(401).json({msg:'users not found'})
        }
        const newUsers=contacts.map((item)=>{
            return {
                id:item.uuid,
                name:item.name,
            }
        })
        return res.status(200).json(newUsers)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const crearUser=async(req,res)=>{
    try {
        req.body.password=bcrypt.hashSync(req.body.password)
        req.body.uuid=uuidv4()
        const user= await User.create(req.body)
        const template= templateVerificar(user.name,user.email,user.ruc,user.company_name)
        await emailVerificar(req.body.email,template)
        return res.status(200).json({status:user.status,role:user.role,id:user.uuid})
    } catch (error) {
        return res.status(400).json(error)
    }
}
const crearUserOperator=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:1}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operator=await Operator.findOne({where:{uuid:isAdmin.uuid}})
        req.body.operatorId=operator.id
        req.body.operator_name=operator.name
        req.body.password=bcrypt.hashSync(req.body.password)
        req.body.uuid=uuidv4()
        const user= await User.create(req.body)
        const template= templateVerificar(user.name,user.email,user.ruc,user.company_name)
        await emailVerificar(req.body.email,template)
        return res.status(200).json({status:user.status,role:user.role,id:user.uuid})
    } catch (error) {
        return res.status(400).json(error)
    }
}

const crearUserAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        req.body.password=bcrypt.hashSync(req.body.password)
        req.body.uuid=uuidv4()
        const user= await User.create(req.body)
        if(user.role==="1"){
            await Operator.create({name:req.body.name,uuid:user.uuid,email:req.body.email})
        }
        const template= templateVerificarAdmin(user.name,user.email)
        await emailVerificar(req.body.email,template)
        return res.status(200).json({status:user.status,role:user.role,id:user.uuid})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const mostrarOperadores=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operadores= await Operator.findAll({
            include:[User],order:[['name','ASC'],[User,'company_name','ASC']]
        })
        const newOperadores=operadores.map(item=>{
            return {
                id:item.uuid,
                name:item.name,
                email:item.email,
                users:item.users.map(i=>{
                    return {
                        id:i.uuid,
                        name:i.name,
                        email:i.email,
                        status:i.status,
                        phone:i.phone,
                        ruc:i.ruc,
                        company_name:i.company_name,
                        social_sector:i.social_sector,
                        annual_income:i.annual_income,
                        name_r:i.name_r,
                        position:i.position,
                        typeDocument:i.typeDocument,
                        document:i.document,
                        email_r:i.email_r,
                        pep:i.pep,
                        validity:i.validity,
                        updatedAt:i.updatedAt,
                    }
                })
            }
        })
        return res.status(200).json(newOperadores)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const asignarOperador=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operator=await Operator.findOne({where:{uuid:req.body.id}})
        await User.update({operatorId:operator.id,operator_name:operator.name},{where:{uuid:req.body.idUser}}) 
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}
const mostrarUsersOperador=async(req,res)=>{
    try {
       const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:1}})
       if(!isAdmin){
           return res.status(401).json({msg:'permission denied'})
       }
       const operator= await Operator.findOne({where:{uuid:req.headers.token}})
       const user=await User.findAll({order:[['company_name','ASC']],where:{operatorId:operator.id}})
       if(!user){
           return res.status(401).json({msg:'users not found'})
       }
       const newUsers=user.map((item)=>{
           return {
               id:item.uuid,
               name:item.name,
               email:item.email,
               status:item.status,
               phone:item.phone,
               ruc:item.ruc,
               company_name:item.company_name,
               social_sector:item.social_sector,
               annual_income:item.annual_income,
               name_r:item.name_r,
               position:item.position,
               typeDocument:item.typeDocument,
               document:item.document,
               email_r:item.email_r,
               pep:item.pep,
               validity:item.validity,
               updatedAt:item.updatedAt,
           }
       })
       return res.status(200).json(newUsers)
   } catch (error) {
       return res.status(400).json(error)
   }
}

const editOperator=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const idsArray=req.body.ids.slice(1,-1).split(',')
        const operator= await Operator.findOne({where:{uuid:req.body.id}})
        await User.update({operatorId:null},{where:{operatorId:operator.id}})
        await User.update({operatorId:operator.id},{where:{uuid:idsArray}})
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const loginUser=async(req,res)=>{
    const user=await User.findOne({where:{email:req.body.email}})
    if(!user.status){
        return res.status(401).json({msg:'inactive user'})
    }
    if(user){
        const igualar=bcrypt.compareSync(req.body.password,user.password)
        if (igualar) {
            res.status(200).json({status:user.status,role:user.role,id:user.uuid})
        } else {
            return res.status(401).json({msg:'Invalid password'})
        }
    }else{
        return res.status(401).json({msg:'Invalid email'})
    }
}

const forgotPassword=async(req,res)=>{
    try {
        const {email,ruc}=req.body
        const user= await User.findOne({where:{ruc:ruc,email:email}})
        const token=nanoid(6).toLocaleUpperCase()
        await user.update({resetpass:token},{where:{ruc:ruc}})
        const template= templateResetear(user.name,token,user.email)
        await emailResetear(email,template)
        return res.json({msg:'token sent'})
        
    } catch (error) {
        return res.status(400).json(error)
    }
}

const resetPassword=async(req,res)=>{
    const {password,password2,token}=req.body
    const user=await User.findOne({where:{resetpass:token}})
    if(!user){
        return res.status(400).json({msg:'invalid token'})
    }
    try {
        if(password===password2){
            const newPassword=bcrypt.hashSync(password)
            await user.update({password:newPassword},{where:{resetpass:token}})
            res.status(200).json({msg:'password updated successfully'})
        }else{
            return res.status(401).json({msg:'invalid password'})
        }
    } catch (error) {
        return res.status(400).json({msg:'invalid token'})
    }
}

const editUser=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const user= await User.findOne({where:{uuid:req.body.id}})
        if(!user){
            return res.status(400).json({msg:'user not found'})
        }
        await user.update(req.body)
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}

const deleteOperator=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operator= await User.findOne({where:{uuid:req.body.id,role:1}})
        if(!operator){
            return res.status(401).json({msg:'operator not found'})
        }
        const operatorN= await Operator.findOne({where:{uuid:req.body.id}})
        await User.update({operatorId:null},{where:{operatorId:operatorN.id}})
        await User.destroy({where:{uuid:operator.uuid}})
        await Operator.destroy({where:{uuid:operator.uuid}})
        return res.status(200).json({msg:'deleted successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}
const deleteUser=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:0}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const user= await User.findOne({where:{uuid:req.body.id,role:2}})
        if(!user){
            return res.status(401).json({msg:'user not found'})
        }
        await User.destroy({where:{uuid:user.uuid}})
        return res.status(200).json({msg:'deleted successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}
const editPassword=async(req,res)=>{
    try {
        const {password,email}=req.body
        const user= await User.findOne({where:{email:email}})
        if(!user){
            return res.status(400).json({msg:'user not found'})
        }
        const newPassword=bcrypt.hashSync(password)
        await user.update({password:newPassword},{where:{email:email}})
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports={
    mostrarUsers,
    mostrarUser,
    crearUser,
    loginUser,
    forgotPassword,
    resetPassword,
    emailUser,
    editUser,
    mostrarUsersNameToken,
    crearUserAdmin,
    asignarOperador,
    mostrarOperadores,
    mostrarUsersOperador,
    editOperator,
    deleteOperator,
    mostrarUsersNameTokenOperador,
    crearUserOperator,
    deleteUser,
    editPassword
}