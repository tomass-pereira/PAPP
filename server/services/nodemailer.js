require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
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

// .env


// Como usar em outros arquivos:
// exemplo.js
