const { handleError } = require("../utils/errorHandler.js");
const User = require("../models/user.model.js");
const { sendAutoMail } = require("../controllers/notificacion.controller.js");

async function notificationNewBenefit(benefit) {
    try {
        const users = await User.find()
        .select("-password")
        .populate("roles")
        .exec();
        users.forEach(user => {
            if (user.roles[0].name === "user") {
                const mailOptions = {
                    from: `Tarjeta Vecino`,
                    to: user.email,
                    subject: "Nuevo beneficio",
                    html:`<html>
                        <body>
                            <p>Hola ${user.firstName} ${user.lastName},<br> 
                            desde hoy tienes disponible el nuevo beneficio ${benefit.name}</p>
                        </body>
                        </html>`
                };
                sendAutoMail(mailOptions);   
            }
        });
    } catch (error) {
        handleError(error, "notification.service -> notificationNewBenefit");
    }
}

async function notificationVerifyToken(user) {
    try {
        const mailOptions = {
            from: `Votaciones CEE`,
            to: user.email,
            subject: "Código de verificación de cuenta",
            html:`<html>
                <body>
                    <p>Hola ${user.firstName} ${user.lastName},<br> 
                    para verificar tu cuenta debes ingresar el siguiente código: ${user.verifyToken}</p>
                </body>
                </html>`
        };
        sendAutoMail(mailOptions);
    } catch (error) {
        handleError(error, "notification.service -> notificationVerifyToken");
    }
}

async function notificationChangeStatus(user) {
    try {
        const mailOptions = {
            from: `Tarjeta Vecino`,
            to: user.email,
            subject: "Cambio en estado de tramite",
            html:`<html>
                <body>
                    <p>Hola ${user.firstName} ${user.lastName},<br> 
                    tu solicitud de TARJETA VECINO ha cambiado al estado ${user.applicationStatus}</p>
                </body>
                </html>`
        };
        sendAutoMail(mailOptions);
    } catch (error) {
        handleError(error, "notification.service -> notificationChangeStatus");
    }
}

async function notificationNewUser(user) {
    try {
        const mailOptions = {
            from: `Tarjeta Vecino`,
            to: user.email,
            subject: "Bienvedido a Tarjeta Vecino",
            html:`<html>
                <body>
                    <p>Hola ${user.firstName} ${user.lastName}.<br> 
                    Queremos darte la bienvenida al portal TARJETA VECINO!<br> 
                    Debes rellenar tu formulario iniciando sesión en la web para postular a la tarjeta vecino.</p>
                </body>
                </html>`
        };
        sendAutoMail(mailOptions);
    } catch (error) {
        handleError(error, "notification.service -> notificationChangeStatus");
    }
}

async function changeStateForm(id, estado) {

    console.log(id, estado)
    try {
        console.log("entro a try")
        const user = await User.findOne({form: id })
        .select("-password")
        .populate("roles")
        .exec();

        console.log(user)

        if (!user) {
        return [null, "Usuario no encontrado"];
        }

        if(estado == "0"){
            const mailOptions = {
                from: `Tarjeta Vecino`,
                to: user.email,
                subject: "Cambio en estado de tramite",
                html:`<html>
                    <body>
                        <p>Hola ${user.firstName} ${user.lastName}.<br> 
                        Tu formulario ha sido RECHAZADO<br> 
                        Puedes iniciar una apelación en nuestra web.</p>
                    </body>
                    </html>`
            };
            sendAutoMail(mailOptions);
        } else if(estado == "1"){
            const mailOptions = {
                from: `Tarjeta Vecino`,
                to: user.email,
                subject: "Cambio en estado de tramite",
                html:`<html>
                    <body>
                        <p>Hola ${user.firstName} ${user.lastName}.<br> 
                        Tu formulario ha sido ACEPTADO<br> 
                        Debes acercarte a la muninipalidad para pedir tu tarjeta.</p>
                    </body>
                    </html>`
            };
            sendAutoMail(mailOptions);
        }
    } catch (error) {
        handleError(error, "notification.service -> notificationChangeStatus");
    }
}


module.exports = {
    notificationNewBenefit,
    notificationChangeStatus,
    notificationNewUser,
    changeStateForm,
    notificationVerifyToken
    };