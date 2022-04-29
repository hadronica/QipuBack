const User=require('../models/usuarios')
const Billing=require('../models/facturas')
const Contact=require('../models/contactos')
const Operation=require('../models/operaciones')
const fs=require('fs')
require('dotenv').config()
const { nanoid } = require('nanoid')

const aws=require('aws-sdk')
const { emailFactura, templateFactura } = require('../middlewares/emailValidator')
const s3=new aws.S3({
    region:'sa-east-1',
    accessKeyId:process.env.AWSID,
    secretAccessKey:process.env.AWSKEY
})

const getInfo=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const bills=await Billing.findAll({where:{userId:user.id}})
        if(bills.length==0){
            return res.status(200).json({msg:'billings not found'})
        }
        const newBills=bills.map(item=>{
            return {
                id:item.uuid,
                billing_id:item.billing_id,
                amount:item.amount,
                detraction:item.detraction,
                net_amount:item.net_amount,
                account:item.account,
                contactName:item.contactName,
                date_emission:item.date_emission,
                status:item.status,
                date_payment:item.date_payment,
                n_days:item.n_days,
                monthly_fee:item.monthly_fee,
                commission:item.commission,
                partnet:item.partnet,
                first_payment:item.first_payment,
                second_payment:item.second_payment,
                commercial:item.commercial,
                n_commercial_qipu:item.n_commercial_qipu,
                bank_name:item.bank_name,
                n_operation:item.n_operation,
                createdAt:item.createdAt,
                updatedAt:item.updatedAt,
                date_payout:item.date_payout
            }
        })
        return res.status(200).json(newBills)
    } catch (error) {
        res.status(400).json(error)
    }
}

const getInfoAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const bills=await User.findAll({where:{role:2},include:[Billing]})
        if(bills.length===0){
            return res.status(200).json({msg:'billings not found'})
        }
        const newBills=bills.map(item=>{
            return {
                id:item.uuid,
                name:item.name,
                company_name:item.company_name,
                billings:item.billings.map(i=>{
                    return {
                        id:i.uuid,
                        billing_id:i.billing_id,
                        amount:i.amount,
                        detraction:i.detraction,
                        net_amount:i.net_amount,
                        account:i.account,
                        contactName:i.contactName,
                        date_emission:i.date_emission,
                        status:i.status,
                        date_payment:i.date_payment,
                        n_days:i.n_days,
                        monthly_fee:i.monthly_fee,
                        commission:i.commission,
                        partnet:i.partnet,
                        first_payment:i.first_payment,
                        second_payment:i.second_payment,
                        commercial:i.commercial,
                        n_commercial_qipu:i.n_commercial_qipu,
                        bank_name:i.bank_name,
                        n_operation:i.n_operation,
                        createdAt:i.createdAt,
                        updatedAt:i.updatedAt,
                        date_payout:item.date_payout
                    }
                })
            }
        })
        return res.status(200).json(newBills)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const getInfoUserAdmin=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const user= await User.findOne({where:{uuid:req.body.id}})
        if(!user){
            return res.status(401).json({msg:'client not found'})
        }
        const pagador=await Contact.findOne({where:{full_name:req.body.name}})
        if(!pagador){
            return res.status(401).json({msg:'debtors not found'})
        }
        const bills=await Billing.findAll({where:{userId:user.id,contactName:pagador.full_name}})
        if(bills.length==0){
            return res.status(200).json({msg:'billings not found'})
        }
        const newBills=bills.map(item=>{
            return {
                id:item.uuid,
                billing_id:item.billing_id,
                amount:item.amount,
                date_emission:item.date_emission
            }
        })
        return res.status(200).json(newBills)
    } catch (error) {
        res.status(400).json(error)
    }
}

const createBill=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        const newName=user.name.replaceAll(" ","")
        req.body.userId=user.id
        req.body.uuid=nanoid(10)
        const contact=req.body.contactName
        const newContact=contact.replaceAll(" ","")
        const pdfFile=req.files.pdf
        const tempPdfPath=pdfFile.tempFilePath
        fs.readFile(tempPdfPath, function(err, data) {
            let params={Bucket:process.env.AWSBUCKET,Key:`${newName}/pagadores/${newContact}/PDF${req.body.billing_id}`,Body: data,ACL: 'public-read',ContentType:pdfFile.mimetype}
            s3.upload(params, function(err, data) {
                fs.unlink(tempPdfPath, function(err) {
                    if (err) {
                      throw new Error(err)
                    }
                })
            })
        })
        const xmlFile=req.files.xml
        const tempXmlPath=xmlFile.tempFilePath
        fs.readFile(tempXmlPath, function(err, data) {
            let params={Bucket:process.env.AWSBUCKET,Key:`${user.name}/pagadores/${req.body.contactName}/XML${req.body.billing_id}`,Body: data,ACL: 'public-read',ContentType:xmlFile.mimetype}
            s3.upload(params, function(err, data) {
                fs.unlink(tempXmlPath, function(err) {
                    if (err) {
                      throw new Error(err)
                    }
                })
            })
        })
        await Billing.create(req.body)
        const template=templateFactura(user.name,req.body.billing_id,user.email)
        await emailFactura(user.email,template)
        return res.status(200).json({msg:'created successfully'})
} 
    catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}

const editBill=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const bill= await Billing.findOne({where:{uuid:req.body.id}})
        if(!bill){
            return res.status(400).json({msg:'bill not found'})
        }
        await bill.update(req.body)
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}

const operationBill=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const idsArray=req.body.ids.slice(1,-1).split(',')
        await Operation.create({n_operation:req.body.n_operation,name:req.body.name})
        const operation=await Operation.findOne({where:{n_operation:req.body.n_operation}})
        await Billing.update({n_operation:req.body.n_operation,operationId:operation.id},{where:{uuid:idsArray}})
        return res.status(200).json({msg:'number of operation successfully updated'})
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

const getOperation=async(req,res)=>{
    try {
        const isAdmin=await User.findOne({where:{uuid:req.headers.token,role:[0,1]}})
        if(!isAdmin){
            return res.status(401).json({msg:'permission denied'})
        }
        const operation=await Operation.findAll({include:[Billing]})
        const newOperation=operation.map(item=>{
            return {
                n_operation:item.n_operation,
                name:item.name,
                billings:item.billings.map(i=>{
                    return {
                        id:i.uuid,
                        billing_id:i.billing_id,
                        amount:i.amount,
                        detraction:i.detraction,
                        net_amount:i.net_amount,
                        account:i.account,
                        contactName:i.contactName,
                        date_emission:i.date_emission,
                        status:i.status,
                        date_payment:i.date_payment,
                        n_days:i.n_days,
                        monthly_fee:i.monthly_fee,
                        commission:i.commission,
                        partnet:i.partnet,
                        first_payment:i.first_payment,
                        second_payment:i.second_payment,
                        commercial:i.commercial,
                        n_commercial_qipu:i.n_commercial_qipu,
                        bank_name:i.bank_name,
                        createdAt:i.createdAt,
                        updatedAt:i.updatedAt,
                        date_payout:item.date_payout
                    }
                })
            }
        })
        return res.status(200).json(newOperation)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
}

module.exports={
    getInfo,
    getInfoAdmin,
    getInfoUserAdmin,
    createBill,
    editBill,
    operationBill,
    getOperation
}