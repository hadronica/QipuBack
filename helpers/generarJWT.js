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
const generarJWTLink=(password,email)=>{
    return new Promise((resolve,reject)=>{
        const payload={password,email}
        jwt.sign(payload,secret,{
            expiresIn:'24h'
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
        if(!payload){
            throw new Error('token invalido')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    generarJWT,
    generarJWTLink,
    verifyJWT
}
