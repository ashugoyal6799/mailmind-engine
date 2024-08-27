const pinecone = require('../config/pinecone');
const logger = require('../config/logger');

async function createPineconeIndex() {
    try {
        const existingIndexes = await pinecone.listIndexes();
        const indexName = 'email-embeddings';
        await pinecone.createIndex({
            name: indexName,
            dimension: 1536, // Replace with your model dimensions
            metric: 'euclidean', // Replace with your model metric
            spec: { 
                serverless: { 
                    cloud: 'aws', 
                    region: 'us-east-1' 
                }
            } 
        });
        logger.info(`Pinecone index ${indexName} created successfully.`);
    } catch (error) {
        logger.error('Error creating Pinecone index:', error);
    }
}

async function upsertEmbeddingsToPinecone(emailId, embedding,metadata) {
    try {
        const index = pinecone.index('email-embeddings');

        await index.namespace("ns1").upsert([
            {
                id: emailId.toString(),
                values: embedding,
                metadata : metadata, 
            },
        ]);

        logger.info(`Embedding for email ID ${emailId} upserted successfully.`);
    } catch (error) {
        logger.error('Error upserting embedding to Pinecone:', error);
    }
}

module.exports = {
    createPineconeIndex,
    upsertEmbeddingsToPinecone,
};
