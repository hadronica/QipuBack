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
    uuid:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    }
})

OperatorModel.hasMany(UserModel)

module.exports=OperatorModel