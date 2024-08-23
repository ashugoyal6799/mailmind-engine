const express = require('express');
const gmailRoutes = require('./routes/gmailRoutes');

const app = express();

app.use(express.json());

app.use('/api/gmail', gmailRoutes);
app.use('/test', (req, res) => {
    res.send('Hello World!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
