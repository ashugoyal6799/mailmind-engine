const { google } = require('googleapis');
const { getEmailContent } = require('./emailParser');

async function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.labels.list({ userId: 'me' });
        const labels = res.data.labels;
        if (!labels || labels.length === 0) {
            return [];
        }
        return labels.map(label => label.name);
    } catch (error) {
        console.error('Error listing labels:', error);
        throw error;
    }
}

async function listMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });
        const messages = res.data.messages;
        if (!messages || messages.length === 0) {
            return [];
        }
        const emails = [];
        for (const message of messages) {
            const msg = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });
            const emailData = getEmailContent(msg.data);
            emails.push(emailData);
        }
        return emails;
    } catch (error) {
        console.error('Error listing messages:', error);
        throw error;
    }
}

module.exports = {
    listLabels,
    listMessages,
};
