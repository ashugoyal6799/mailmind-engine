const path = require('path');
const process = require('process');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

module.exports = {
    SCOPES,
    TOKEN_PATH,
    CREDENTIALS_PATH,
};
