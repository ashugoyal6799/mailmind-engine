const { authorize,authorize1 } = require('../services/authService');
const { listLabels, listMessages } = require('../services/gmailService');

async function getLabels(req, res) {
    try {
        const authClient = await authorize1();
        const labels = await listLabels(authClient);
        res.json({ labels });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve labels' });
    }
}

async function getMessages(req, res) {
    try {
        const authClient = await authorize1();
        const messages = await listMessages(authClient);
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
}

module.exports = {
    getLabels,
    getMessages,
};
