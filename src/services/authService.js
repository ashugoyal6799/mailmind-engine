const fs = require('fs').promises;
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const { TOKEN_PATH, CREDENTIALS_PATH, SCOPES } = require('../config/constants');

async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials1 = JSON.parse(content);
        const credentials = {
            web: {
                client_id: process.env.GOOGLE_CLIENT_ID,
                project_id: process.env.GOOGLE_PROJECT_ID,
                auth_uri: process.env.GOOGLE_AUTH_URI,
                token_uri: process.env.GOOGLE_TOKEN_URI,
                auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uris: [process.env.GOOGLE_REDIRECT_URIS],
            }
        };
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

module.exports = {
    authorize,
};
