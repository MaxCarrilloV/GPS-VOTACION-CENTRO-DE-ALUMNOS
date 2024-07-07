const { handleError } = require("../utils/errorHandler.js");
const { sendAutoMail } = require("../controllers/notificacion.controller.js");

async function notificationVerifyToken(user) {
    try {
        const mailOptions = {
            from: `Votaciones CEE`,
            to: user.email,
            subject: "Código de verificación de cuenta",
            html:`<html>
                <body>
                    <p>Hola ${user.username},<br> 
                    para verificar tu cuenta debes ingresar el siguiente código: ${user.verifyToken}</p>
                </body>
                </html>`
        };
        sendAutoMail(mailOptions);
    } catch (error) {
        handleError(error, "notification.service -> notificationVerifyToken");
    }
}

module.exports = {
    notificationVerifyToken
    };