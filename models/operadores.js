const Sequelize=require('sequelize')
const {sequelize}=require('../db')
const UserModel=require('./usuarios')

const OperatorModel=sequelize.define('operators',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,  
    },
    name:{
        type:Sequelize.STRING,
    },
    users:{
        type:Sequelize.STRING,
    }
})

// OperationModel.hasMany(BillingModel)

module.exports=OperatorModel