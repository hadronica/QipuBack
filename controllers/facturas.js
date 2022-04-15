const User=require('../models/usuarios')
const Billing=require('../models/facturas')
const fs=require('fs')
require('dotenv').config()

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
        return res.status(200).json(bills)
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
        return res.status(200).json(bills)
    } catch (error) {
        res.status(400).json(error)
    }
}

const createBill=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        req.body.contactContactId=user.id
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
        const template=templateFactura(user.name,req.body.billing_id)
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
        const bill= await Billing.findOne({where:{billing_id:req.params.billing_id}})
        if(!bill){
            return res.status(400).json({msg:'bill not found'})
        }
        await bill.update(req.body)
        return res.status(200).json({msg:'updated successfully'})
    } catch (error) {
        return res.status(400).json(error)
    }
}

module.exports={
    getInfo,
    getInfoAdmin,
    createBill,
    editBill
}