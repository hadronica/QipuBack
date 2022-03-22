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
        return res.status(200).json(bills)
    } catch (error) {
        res.status(400).json(error)
    }
}

const createBill=async(req,res)=>{
    try {
        const user=await User.findOne({where:{uuid:req.headers.token}})
        req.body.contactContactId=user.id
        const file=req.files.file
        const {tempFilePath}=req.files.file
        fs.readFile(tempFilePath, function(err, data) {
            let params={Bucket:process.env.AWSBUCKET,Key:`${user.name}/pagadores/${req.body.contactName}/${req.body.billing_id}`,Body: data,ACL: 'public-read',ContentType:file.mimetype}
            s3.upload(params, function(err, data) {
                fs.unlink(tempFilePath, function(err) {
                    if (err) {
                      throw new Error(err)
                    }
                })
                return req.body.file_link=data.Location
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