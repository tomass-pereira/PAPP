require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });
    }

    async enviarEmail(destinatario, assunto, conteudo) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: destinatario,
                subject: assunto,
                text: conteudo,
                html: `<div>${conteudo}</div>`
            };

            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw error;
        }
    }

}


module.exports = new EmailService();
