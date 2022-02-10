const router=require('express').Router()
const apiUserRouter=require('./api/usuarios')

router.use('/usuarios',apiUserRouter)


module.exports=router