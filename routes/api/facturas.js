const { getInfo, getInfoAdmin, createBill, editBill, getInfoUserAdmin, operationBill } = require('../../controllers/facturas')

const router=require('express').Router()

router.get('/info-billing',getInfo)
router.get('/info-billing-admin',getInfoAdmin)
router.post('/info-user',getInfoUserAdmin)

router.post('/create-bill',createBill)

router.put('/edit-bill',editBill)

router.put('/operation-bill',operationBill)



module.exports=router