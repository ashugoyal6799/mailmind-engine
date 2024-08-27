const express = require('express');
const gmailRoutes = require('./routes/gmailRoutes');
const { createPineconeIndex } = require('./services/pineconeService');
const searchRoutes = require('./routes/searchRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const logger = require('./config/logger');

const app = express();

app.use(express.json());

app.use('/api/gmail', gmailRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/test', (req, res) => {
    res.send('Hello World!');
});

try{
    // Create the Pinecone index on startup (if it doesn't already exist)
(async () => {
    await createPineconeIndex();
})();
}catch(err){
    logger.error(err);
}



app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
