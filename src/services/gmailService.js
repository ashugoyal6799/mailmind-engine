const { google } = require('googleapis');
const { getEmailContent } = require('./emailParser');
const { generateEmbedding } = require('./openaiService');
const { upsertEmbeddingsToPinecone } = require('./pineconeService');
const { analyzeSentimentAndAssignUrgency } = require('./sentimentAnalysisService');

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
        logger.error('Error listing labels:', error);
        throw error;
    }
}

async function listMessages(auth, isEmailsToBeUpserted = false) {
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

            if (isEmailsToBeUpserted === true) {
                // Generate the embedding for the email content
            const embedding = await generateEmbedding(emailData.body);

            if (embedding) {
                // Upsert the embedding to Pinecone and include metadata
                const metadata = { text: emailData.body };
                const sentimentAndUrgency = await analyzeSentimentAndAssignUrgency(emailData.body);
                metadata.sentiment = sentimentAndUrgency.sentiment;
                metadata.urgency = sentimentAndUrgency.urgency;
                
                await upsertEmbeddingsToPinecone(message.id, embedding, metadata);
            }
            }
            
        }
        return emails;
    } catch (error) {
        logger.error('Error listing messages:', error);
        throw error;
    }
}

module.exports = {
    listLabels,
    listMessages,
};
