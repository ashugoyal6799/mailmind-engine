const { generateEmbedding } = require('../services/openaiService');
const { querySimilarEmails } = require('../services/searchService');


async function getSearchedEmails (req, res) {

    try {
        const { text , count} = req.body;
        const results = await querySimilarEmails(text, count);
        res.status(200).json(results);
    } catch (error) {
        logger.error('Error searching similar emails:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {getSearchedEmails};