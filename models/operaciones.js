const Sequelize=require('sequelize')
const {sequelize}=require('../db')
const BillingModel=require('./facturas')

const OperationModel=sequelize.define('operations',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,  
    },
    n_operation:{
        type:Sequelize.STRING,
    },
    name:{
        type:Sequelize.STRING,
    },
    contact:{
        type:Sequelize.STRING,
    }
})
OperationModel.hasMany(BillingModel)

module.exports=OperationModel