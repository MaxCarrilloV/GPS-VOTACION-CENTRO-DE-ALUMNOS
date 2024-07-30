const { handleError } = require("../utils/errorHandler.js");
const { sendAutoMail } = require("../controllers/notificacion.controller.js");
const User = require("../models/user.model.js");

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

async function notificationAviso(aviso) {
    const users = await User.find()
        .select("-password")
        .populate("roles")
        .exec();

    users.forEach(user => {
        if (user.roles[0].name === "user") {
            const mailOptions = {
                from: 'TRICEL',
                to: user.email,
                subject: aviso.titulo,
                html:`<html>
                    <body>
                        <p>Hola ${user.username},<br>
                        ${aviso.contenido}</p>
                    </body>
                    </html>`
            };
            sendAutoMail(mailOptions);
        }
    });
}

async function notificationActividad(actividad) {
    const users = await User.find()
        .select("-password")
        .populate("roles")
        .exec();

    users.forEach(user => {
        if (user.roles[0].name === "user") {
            const mailOptions = {
                from: 'CEE',
                to: user.email,
                subject: actividad.nombre,
                html:`<html>
                    <body>
                        <p>Hola ${user.username},<br>
                        ${actividad.descripcion}</p>
                    </body>
                    </html>`
            };
            sendAutoMail(mailOptions);
        }
    });
}

module.exports = {
    notificationVerifyToken,
    notificationAviso,
    notificationActividad,
    };