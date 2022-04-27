const router=require('express').Router()
const apiUserRouter=require('./api/usuarios')
const apiAuthRouter=require('./api/auth')
const apiContactRouter=require('./api/contactos')
const apiAWSRouter=require('./api/aws')
const apiBillingRouter=require('./api/facturas')

router.use('/user',apiUserRouter)
router.use('/auth',apiAuthRouter)
router.use('/contact',apiContactRouter)
router.use('/aws',apiAWSRouter)
router.use('/billing',apiBillingRouter)


module.exports=router