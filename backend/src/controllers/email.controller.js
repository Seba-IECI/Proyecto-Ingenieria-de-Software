import { sendEmail } from "../services/email.service.js";
import {
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export const sendCustomEmail = async (req, res) => {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
        return handleErrorServer(res, 400, "Faltan datos para enviar el correo.");
    }

    try {
        const info = await sendEmail(
            email,
            subject,
            message,
            `<p>${message}</p>`
        );

        handleSuccess(res, 200, "Correo enviado con éxito.", info);
    } catch (error) {
        handleErrorServer(res, 500, "Error durante el envío de correo.", error.message);
    }
};
