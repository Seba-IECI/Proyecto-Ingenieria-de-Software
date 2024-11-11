import { sendEmail } from "../services/email.service.js";
import {
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

export const sendCustomEmail = async (req, res) => {
    const { email, subject, message } = req.body;

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

export const sendEmailDefault = async (req) => {
    const { email, message, subject } = req.body;

    try {
        const info = await sendEmail(
            email,
            subject,
            message,
            `<p>${message}</p>`
        );

        return {
            success: true,
            data: info
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};