const nodemailer = require('nodemailer');

const sendMail = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ID || 'abc@gmail.com',
                pass: process.env.MAIL_PASS || 'abcom',
            }
        });

        let mailOptions = {
            from: process.env.MAIL_ID || 'abc@gmail.com',
            to: email,
            subject: subject,
            text: text
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendMail;