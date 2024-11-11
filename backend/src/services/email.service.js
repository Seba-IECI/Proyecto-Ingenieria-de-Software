import nodemailer from "nodemailer";
import { emailConfig } from "../config/configEnv.js";

const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"Ingeniería de Software 2024 - 2" <${emailConfig.user}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        
        await transporter.sendMail(mailOptions);

        return mailOptions;
    } catch (error) {
        console.error("Error enviando el correo:", error.message);
        throw new Error("Error enviando el correo: " + error.message);
    }
};
