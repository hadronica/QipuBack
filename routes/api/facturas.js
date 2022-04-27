const { getInfo, getInfoAdmin, createBill, editBill, getInfoUserAdmin, operationBill } = require('../../controllers/facturas')

const router=require('express').Router()

router.get('/list-admin',getInfoAdmin)
router.get('/list',getInfo)

router.post('/info-user',getInfoUserAdmin)

router.post('/create',createBill)

router.put('/edit',editBill)

router.put('/operation',operationBill)



module.exports=router