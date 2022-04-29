const Sequelize=require('sequelize')
const {sequelize}=require('../db')

const BillingModel=sequelize.define('billings',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,  
    },
    billing_id:{
        type:Sequelize.STRING
    },
    amount:{
        type:Sequelize.STRING
    },
    detraction:{
        type:Sequelize.STRING
    },
    net_amount:{
        type:Sequelize.STRING
    },
    account:{
        type:Sequelize.STRING
    },
    contactName:{
        type:Sequelize.STRING
    },
    date_emission:{
        type:Sequelize.STRING
    },
    status:{
        type:Sequelize.STRING
    },
    date_payment:{
        type:Sequelize.STRING
    },
    n_days:{
        type:Sequelize.STRING
    },
    monthly_fee:{
        type:Sequelize.STRING
    },
    commission:{
        type:Sequelize.STRING
    },
    partnet:{
        type:Sequelize.STRING
    },
    first_payment:{
        type:Sequelize.STRING
    },
    second_payment:{
        type:Sequelize.STRING
    },
    commercial:{
        type:Sequelize.STRING
    },
    n_commercial_qipu:{
        type:Sequelize.STRING
    },
    bank_name:{
        type:Sequelize.STRING
    },
    n_operation:{
        type:Sequelize.STRING
    },
    uuid:{
        type:Sequelize.STRING
    },
    date_payout:{
        type:Sequelize.STRING
    },
    pdfLink:{
        type:Sequelize.STRING
    },
    xmlLink:{
        type:Sequelize.STRING
    }
})

module.exports=BillingModel