const jwt=require('jsonwebtoken')


const secret=process.env.SECRETORPRIVATEKEY

const generarJWT=(ruc,email)=>{
    return new Promise((resolve,reject)=>{
        const payload={ruc,email}
        jwt.sign(payload,secret,{
            expiresIn:'30d'
        },(err,token)=>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            } else{
                resolve(token)
            }
        })
    })
}
const generarJWTLink=(ruc,email)=>{
    return new Promise((resolve,reject)=>{
        const payload={ruc,email}
        jwt.sign(payload,secret,{
            expiresIn:'15m'
        },(err,token)=>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            } else{
                resolve(token)
            }
        })
    })
}

const verifyJWT=(token,key)=>{
    try {
        const payload=jwt.verify(token,key)
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    generarJWT,
    generarJWTLink,
    verifyJWT
}
