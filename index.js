const { response } = require('express')
const express =require('express')
const cors = require('cors')
const fileUpload=require('express-fileupload')
require('dotenv').config()
require('./db')

const port=process.env.PORT||8000
const apiRouter=require('./routes/api')
const bodyParser=require('body-parser')


const app=express()
app.use(cors())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/',
    createParentPath:true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',apiRouter)

app.listen(port,()=>{
    console.log('App running on port ',port)
})