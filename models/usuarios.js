const Sequelize=require('sequelize')
const {sequelize}=require('../db')
const ContactModel = require('./contactos')

const UserModel=sequelize.define('users',{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        name:{
            type:Sequelize.STRING,
        },
        password:{
            type:Sequelize.STRING(150)
        },
        email:{
            type:Sequelize.STRING
        },
        status:{
            type:Sequelize.BOOLEAN,
            defaultValue:true
        },
        role:{
            type:Sequelize.INTEGER,
            defaultValue:2
        },
        phone:{
            type:Sequelize.STRING
        },
        ruc:{
            type:Sequelize.STRING,
        },
        company_name:{
            type:Sequelize.STRING
        },
        social_sector:{
            type:Sequelize.STRING
        },
        annual_income:{
            type:Sequelize.STRING
        },
        name_r:{
            type:Sequelize.STRING
        },
        position:{
            type:Sequelize.STRING
        },
        typeDocument:{
            type:Sequelize.BOOLEAN,
            defaultValue:1
        },
        document:{
            type:Sequelize.STRING
        },
        email_r:{
            type:Sequelize.STRING
        },
        pep:{
            type:Sequelize.BOOLEAN,
            defaultValue:0
        },
        uuid:{
            type:Sequelize.STRING
        },
        terms_conditions:{
            type:Sequelize.BOOLEAN,
        }
})
UserModel.hasMany(ContactModel)


module.exports=UserModel