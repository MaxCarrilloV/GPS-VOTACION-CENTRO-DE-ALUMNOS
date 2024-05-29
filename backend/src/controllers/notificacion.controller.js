const nodemailer = require('nodemailer');
const { MAIL_TOKEN } = require('../config/configEnv');
const { EMAIL } = require('../config/configEnv');
const { respondSuccess } = require('../utils/resHandler');

const sendAutoMail = (data) => {

    const token = MAIL_TOKEN;
    const mail = EMAIL;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: mail,
            pass: token
        }  
    })
    transporter.sendMail(data, (error, info) => {
        if(error){
            console.log(error)
        }
        console.log('Correo enviado correctamente')
    })

    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
}

async function sendMail(req, res){
    const {email, asunto, mensaje} = req.body; 
    const token = MAIL_TOKEN;
    const mail = EMAIL;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: mail,
            pass: token
        }  
    })
    var data = {
        from: `Tarjeta Vecino`,
        to: email,
        subject: `${asunto}`,
        //text: `Hola ${user.username}, desde hoy tienes disponible el nuevo beneficio ${benefit.name}`,
        html:`<html>
            <body>
                <p>Hola vecino,<br> 
                ${mensaje}</p>
            </body>
            </html>`
    };
    transporter.sendMail(data, (error, info) => {
        if(error){
            return res.status(400).send({message:'Error al enviar el correo'})
        }
        respondSuccess(req, res, 201, 'Correo enviado correctamente');
    })
    transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
}

module.exports = {
    sendAutoMail,
    sendMail
}

