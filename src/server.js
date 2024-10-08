const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
