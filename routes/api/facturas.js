const { getInfo, getInfoAdmin, createBill, editBill, getInfoUserAdmin, operationBill, getOperation, editOperation, getInfoOperator} = require('../../controllers/facturas')

const router=require('express').Router()

router.get('/list-operator',getInfoOperator)
router.get('/list-admin',getInfoAdmin)
router.get('/list',getInfo)
router.get('/list-operations',getOperation)

router.post('/info-user',getInfoUserAdmin)

router.post('/create',createBill)

router.put('/edit',editBill)
router.put('/edit-operation',editOperation)

router.put('/operation',operationBill)



module.exports=router