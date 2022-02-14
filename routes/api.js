const router=require('express').Router()
const apiUserRouter=require('./api/usuarios')
const apiAuthRouter=require('./api/auth')

router.use('/usuarios',apiUserRouter)
router.use('/auth',apiAuthRouter)


module.exports=router