const fs = require('fs').promises;
require('dotenv').config();
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const { TOKEN_PATH, CREDENTIALS_PATH, SCOPES } = require('../config/constants');


// Not using the File way to store tokens anymore - Putting that env file
/*
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials= JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (!client) {
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
    }
    return client;
}
*/


async function authorize1(){
    try{
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error('Missing Google API credentials in environment variables');
        }

        const auth = new google.auth.OAuth2(clientId, clientSecret);
        auth.setCredentials({
            refresh_token: refreshToken,
        });

        return auth;
    }catch(err){
        return null;
    }
}

module.exports = {
    authorize,
    authorize1,
};
