import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer";

export default class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Yandex',
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD2,
            }
        })
    }
    async sendEmail(email, link) {
        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Activation Email',
            text: '',
            html: `
            <div>
                <h1>For activation on website please follow the link</h1>
                <a href="${link}">${link}</a>
            </div>`,
        })
    }
}