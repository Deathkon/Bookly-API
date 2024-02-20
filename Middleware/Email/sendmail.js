'use strict';
require('dotenv').config();

const nodemailer = require('nodemailer');

// Create a transporter object outside the function to reuse it
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
    },
});

// Define the email options
function createEmail(to, subject, text) {
    return {
        from: process.env.EMAIL_AUTH_USER,
        to: to,
        subject: subject,
        text: text,
    };
}

async function sendMail(to, subject, text) {
    try {
        // Create the email options
        const mailOptions = createEmail(to, subject, text);

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendMail;