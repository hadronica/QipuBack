const Sequelize=require('sequelize')
const {sequelize}=require('../db')

const ContactModel=sequelize.define('contacts',{
        contact_id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        ruc:{
            type:Sequelize.STRING
        },
        full_name:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        email_extra:{
            type:Sequelize.STRING
        },
        phone:{
            type:Sequelize.STRING
        },
        name_debtor:{
            type:Sequelize.STRING
        },
        status:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        },
        uuid:{
            type:Sequelize.STRING
        }
    })


module.exports=ContactModel