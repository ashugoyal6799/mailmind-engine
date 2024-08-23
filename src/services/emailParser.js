function getEmailContent(message) {
    let subject = '';
    let body = '';

    const headers = message.payload.headers;
    headers.forEach(header => {
        if (header.name === 'Subject') {
            subject = header.value;
        }
    });

    const parts = message.payload.parts;
    if (parts && parts.length) {
        body = getBody(parts);
    } else {
        body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
    }

    return { subject, body };
}

function getBody(parts) {
    for (const part of parts) {
        if (part.parts) {
            return getBody(part.parts);
        } else if (part.mimeType === 'text/plain') {
            return Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
    }
    return '';
}

module.exports = {
    getEmailContent,
};
