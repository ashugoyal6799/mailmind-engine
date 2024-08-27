const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
    level: 'info', // Default log level
    format: combine(
        colorize(), // Colorize the output for easier reading in the console
        timestamp(), // Add a timestamp to each log message
        logFormat // Use the custom log format
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({ filename: 'app.log' }) // Log to a file
    ],
});

module.exports = logger;
