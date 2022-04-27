const fs=require('fs')
require('dotenv').config()
const User=require('../models/usuarios')

const aws=require('aws-sdk')
const s3=new aws.S3({
    region:'sa-east-1',
    accessKeyId:process.env.AWSID,
    secretAccessKey:process.env.AWSKEY
})

const listFiles=async(req,res)=>{
    const user=await User.findOne({where:{uuid:req.headers.token}})
    if(!user){return res.status(401).json({msg:'User not found'})}
    const newName=user.name.replaceAll(" ","")

    let params={Bucket:process.env.AWSBUCKET,Prefix:`${newName}`}
    s3.listObjectsV2(params,(err,data)=>{
        if(err) throw err

        const links=data.Contents.map((item)=>{
          const arr=["ruc","dni","rtt","repre"]
          const type=item.Key.replace("/"," ").split(" ")
          return {
            type:type[1] , 
            file: "https://qipudb-test.s3.sa-east-1.amazonaws.com/"+item.Key
          }
        })
        return res.status(200).json(links)
    })
}

const uploadFile=async(req,res)=>{
    const user=await User.findOne({where:{uuid:req.headers.token}})
    if(!user){return res.status(401).json({msg:'User not found'})}
    const newName=user.name.replaceAll(" ","")

    const {file}=req.files
    const {tempFilePath}=req.files.file

    fs.readFile(tempFilePath, function(err, data) {
        let params={Bucket:process.env.AWSBUCKET,Key:`${newName}/${req.params.type}`,Body: data,ACL: 'public-read',ContentType:file.mimetype}
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



module.exports={
    listFiles,
    uploadFile
}
