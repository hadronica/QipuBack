const { check } = require('express-validator')
const { uploadFile, listFiles, downloadFile } = require('../../controllers/aws')
const { validarCampo } = require('../../middlewares/validarCampo')
const router=require('express').Router()


router.post('/listfiles',listFiles)

router.post('/upload/:type',[
    check('type').isIn(['ruc','dni','rtt','repre','info']),
    validarCampo
],uploadFile)


module.exports=router