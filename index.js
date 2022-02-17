const { response } = require('express')
const express =require('express')
const cors = require('cors')
require('dotenv').config()
require('./db')

const apiRouter=require('./routes/api')
const bodyParser=require('body-parser')


const app=express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api',apiRouter)

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo')
})