const fs=require('fs')
require('dotenv').config()
const User=require('../models/usuarios')
const fileUpload=require('express-fileupload')


const aws=require('aws-sdk')
const s3=new aws.S3({
    region:'sa-east-1',
    accessKeyId:process.env.AWSID,
    secretAccessKey:process.env.AWSKEY
})
const listFiles=async(req,res)=>{
    const user=await User.findOne({where:{uuid:req.headers.token}})
    if(!user){return res.status(401).json({msg:'User not found'})}

    let params={Bucket:process.env.AWSBUCKET,Prefix:`${user.name}`}
    s3.listObjectsV2(params,(err,data)=>{
        if(err) throw err
        return res.status(200).json(data.Contents)
    })
}

const uploadFile=async(req,res)=>{
    const user=await User.findOne({where:{uuid:req.headers.token}})
    if(!user){return res.status(401).json({msg:'User not found'})}

    const {file}=req.files
    const {tempFilePath}=req.files.file

    fs.readFile(tempFilePath, function(err, data) {
        let params={Bucket:process.env.AWSBUCKET,Key:`${user.name}/${req.params.type}`,Body: data,ACL: 'public-read',ContentType:file.mimetype}
        s3.upload(params, function(err, data) {
          fs.unlink(tempFilePath, function(err) {
            if (err) {
              throw new Error(err)
            }
          })

        if (err) {
          return res.status(400).json({msg:err})
        } else {
          return res.status(200).json({msg:'uploaded successfully',link:data.Location})
        }
      })
    })
}

const downloadFile=async(req,res)=>{
    const user=await User.findOne({where:{uuid:req.headers.token}})
    if(!user){return res.status(401).json({msg:'User not found'})}

    let params={Bucket:process.env.AWSBUCKET,Key:`${user.name}/${req.params.type}`}
    s3.getObject(params,(err,data)=>{
        if(err) throw err
        console.log(data)
        fs.writeFile(req.params.type,data.Body,'binary',(err)=>{
            if(err) throw err
            else return res.status(200).json({msg:'downloaded succesfully',data})
        })
    })

}


module.exports={
    listFiles,
    uploadFile,
    downloadFile
}
