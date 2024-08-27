const pinecone = require('../config/pinecone');  // Import the Pinecone client
const logger = require('../config/logger');
const { generateEmbedding } = require('./openaiService');

async function querySimilarEmails(text, topK = 5) {
    try {
        
        // Generate an embedding for the search text
        const embedding = await generateEmbedding(text);

        const index = pinecone.index('email-embeddings');  // Access the index

        const queryResponse = await index.namespace("ns1").query({
            topK,
            includeMetadata: true,  // Ensure metadata is included in the response
            vector: embedding,
        });

        // Process the results and extract relevant data
        const results = queryResponse.matches.map(match => ({
            id: match.id,
            score: match.score,
            text: match.metadata.text,  // Retrieve the original text from metadata
            sentiment: match.metadata.sentiment,  // Include sentiment if it's stored
            urgency: match.metadata.urgency,  // Include urgency if it's stored
        }));

        // Sort results by urgency level in descending order (higher urgency first)
        results.sort((a, b) => b.urgency - a.urgency);
        
        logger.info('Query results:', results);
        return results;
    } catch (error) {
        logger.error('Error querying Pinecone index:', error);
        return [];
    }
}

module.exports = {
    querySimilarEmails,
};
