const router=require('express').Router()
const apiUserRouter=require('./api/usuarios')
const apiAuthRouter=require('./api/auth')
const apiContactRouter=require('./api/contactos')
const apiAWSRouter=require('./api/aws')

router.use('/usuarios',apiUserRouter)
router.use('/auth',apiAuthRouter)
router.use('/contactos',apiContactRouter)
router.use('/aws',apiAWSRouter)


module.exports=router