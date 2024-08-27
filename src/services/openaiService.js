const openai = require('../config/openai');

async function generateEmbedding(text) {
    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text, 
        });

        if (response.data && response.data.length > 0) {
            return response.data[0].embedding;
        } else {
            throw new Error('Unexpected response format from OpenAI');
        }
    } catch (error) {
        logger.error('Error generating embedding with OpenAI:', error);
        return null;
    }
}

module.exports = {
    generateEmbedding,
};
