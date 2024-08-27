const { sendEmailReport } = require('../services/reportsService');

async function sendReportsController(req, res) {
    try {
        const { text, email } = req.body; // Extract the required fields from the request body

        if (!text || !email) {
            return res.status(400).json({ message: 'Text and email are required fields.' });
        }

        // Call the service function to generate and send the report
        await sendEmailReport(text, email);

        // Send a success response back to the client
        res.status(200).json({ message: `Report successfully sent to ${email}` });
    } catch (error) {
        console.error('Error in sendReportsController:', error.message);
        res.status(500).json({ message: 'An error occurred while sending the report.' });
    }
}

module.exports = {
    sendReportsController,
};
