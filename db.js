const Sequelize= require('sequelize')
const UserModel=require('./models/usuarios')

const sequelize=new Sequelize(process.env.SQLNAME,process.env.USER,process.env.USER_PASS,{
    dialect:'mysql',
    host:process.env.HOST,
})

const User=UserModel(sequelize,Sequelize)

sequelize.sync()
    .then(()=>{
        console.log('ok')
    })

module.exports={
    User
}