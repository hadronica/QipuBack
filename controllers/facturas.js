const User=require('../models/usuarios')
const Billing=require('../models/facturas')
const Contact=require('../models/contactos')
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
        const bills=await Billing.findAll({where:{contactContactId:user.id}})
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
        const bills=await Billing.findAll()
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
            }
        })
        return res.status(200).json(newBills)
    } catch (error) {
        res.status(400).json(error)
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
        const bills=await Billing.findAll({where:{contactContactId:user.id,contactName:pagador.full_name}})
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
        req.body.contactContactId=user.id
        req.body.uuid=nanoid(10)
        const pdfFile=req.files.pdf
        const tempPdfPath=pdfFile.tempFilePath
        fs.readFile(tempPdfPath, function(err, data) {
            let params={Bucket:process.env.AWSBUCKET,Key:`${user.name}/pagadores/${req.body.contactName}/PDF${req.body.billing_id}`,Body: data,ACL: 'public-read',ContentType:pdfFile.mimetype}
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
        const bill= await Billing.findOne({where:{billing_id:req.body.billing_id}})
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
        await Billing.update({n_operation:req.body.n_operation},{where:{billing_id:idsArray}})
        return res.status(200).json({msg:'number of operation successfully updated'})
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
    operationBill
}