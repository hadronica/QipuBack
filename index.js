const { response } = require('express')
const express =require('express')
require('dotenv').config()
const apiRouter=require('./routes/api')
const bodyParser=require('body-parser')
const app=express()

require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',apiRouter)

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo')
})