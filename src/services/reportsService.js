const logger = require('../config/logger');
const transporter = require('../config/nodemailer');
const { querySimilarEmails } = require('./searchService');

// Service function to generate and send the report
// Service function to generate and send the report via email
async function sendEmailReport(text, recipientEmail) {
    try {
        // Query similar emails and get sorted results by urgency
        const results = await querySimilarEmails(text);

        // Prepare the report content
        const sentimentSummary = `
            <ul>
                <li>Positive: ${results.filter(result => result.sentiment === 'Positive').length}</li>
                <li>Negative: ${results.filter(result => result.sentiment === 'Negative').length}</li>
                <li>Neutral: ${results.filter(result => result.sentiment === 'Neutral').length}</li>
            </ul>
        `;

        const detailedResults = results.map(result => `
            <li>
                <strong>Text:</strong> ${result.text}<br>
                <strong>Sentiment:</strong> ${result.sentiment}<br>
                <strong>Urgency:</strong> ${result.urgency}<br>
            </li>
        `).join('');

        const reportContent = `
            <h1>Email Sentiment Report</h1>
            <p><strong>Text Analyzed:</strong> ${text}</p>
            <p><strong>Sentiment Summary:</strong></p>
            ${sentimentSummary}
            <p><strong>Total Results:</strong> ${results.length}</p>
            <h2>Detailed Results:</h2>
            <ul>
                ${detailedResults}
            </ul>
        `;

        // Set up email options
        const mailOptions = {
            from: process.env.SENDING_EMAIL,      
            to: recipientEmail,                  
            subject: 'Email Analysis Report',  
            html: reportContent,                 
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Report successfully sent to ${recipientEmail}: ${info.response}`);
    } catch (error) {
        logger.error('Error sending email report:', error.message);
        throw error; // Re-throw the error to be handled in the controller
    }
}

module.exports = {
    sendEmailReport,
};

module.exports = {
    sendEmailReport,
};
