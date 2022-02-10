const { response } = require('express')
const express =require('express')
require('dotenv').config()
const apiRouter=require('./routes/api')
const bodyParser=require('body-parser')
const app=express()

require('./db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')

app.use('/api',apiRouter)

app.listen(8080,()=>{
    console.log('Servidor corriendo')
})