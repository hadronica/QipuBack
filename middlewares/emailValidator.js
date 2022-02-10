const nodemailer = require("nodemailer");

const mail={
    user:'mcorteztouzett@gmail.com',
    pass:'S@skia123'
}

  // create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: mail.user, // generated ethereal user
      pass: mail.pass, // generated ethereal password
    },
});

const emailVerificar=async(email,html)=>{
    try {
        await transporter.sendMail({
            from: mail.user, // sender address
            to: email, // list of receivers
            subject: "Validación", // Subject line
            text: "Hello world?", // plain text body
            html: html, // html body
        });
        
    } catch (error) {
        console.log(error)
    }
}
const emailResetear=async(email,html)=>{
    try {
        await transporter.sendMail({
            from: mail.user, // sender address
            to: email, // list of receivers
            subject: "Cambiar contraseña", // Subject line
            text: "Hello world?", // plain text body
            html: html, // html body
        });
        
    } catch (error) {
        console.log(error)
    }
}

const templateVerificar=(name)=>{
    return `
        <div id="email_content">
            <h2>Hola ${name}</h2>
            <p> Para confirmar tu cuenta ingresa aqui</p>
            <a href="http://localhost:8080/confirmacion.html"> Confirmar Cuenta </a>
    `
}
const templateResetear=(ruc,link)=>{
    return `
        <div id="email_content">
            <h2>Hola</h2>
            <p> Para cambiar tu contraseña ingresa aqui</p>
            <a href=${link}> Confirmar Cuenta </a>
    `
}

module.exports={
    emailResetear,
    emailVerificar,
    templateResetear,
    templateVerificar
}

