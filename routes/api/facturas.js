const { getInfo, getInfoAdmin, createBill, editBill, getInfoUserAdmin, operationBill, getOperation} = require('../../controllers/facturas')

const router=require('express').Router()

router.get('/list-admin',getInfoAdmin)
router.get('/list',getInfo)
router.get('/list-operations',getOperation)

router.post('/info-user',getInfoUserAdmin)

router.post('/create',createBill)

router.put('/edit',editBill)

router.put('/operation',operationBill)



module.exports=router