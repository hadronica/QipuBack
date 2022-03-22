const Sequelize= require('sequelize')

const sequelize=new Sequelize(process.env.SQLNAME,process.env.SQL_USER,process.env.SQL_USER_PASS,{
    dialect:'mysql',
    host:process.env.HOST,
})

sequelize.sync()
.then(()=>{
    console.log('ok')
})


module.exports={
    sequelize
}