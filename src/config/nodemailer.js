const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'Yahoo', 'Outlook', etc.
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your app-specific password
    }
});


module.exports = transporter;