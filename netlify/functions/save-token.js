// netlify/functions/save-token.js
const { XataClient } = require('@xata.io/client');
require('dotenv').config();

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    database: process.env.XATA_DATABASE_URL
});

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { token, userId } = JSON.parse(event.body);

        if (!token || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Token and userId are required' })
            };
        }

        try {
            await xata.db.tokens.create({
                token: token,
                userId: userId,
                timestamp: new Date().toISOString()
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Token saved successfully' })
            };
        } catch (error) {
            console.error('Error saving token:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error saving token' })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};