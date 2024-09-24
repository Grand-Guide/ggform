const { XataClient } = require('@xata.io/client');
const fetch = require('node-fetch');

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    database: process.env.XATA_DATABASE,
});

exports.handler = async (event) => {
    const { code } = event.queryStringParameters;

    if (!code) {
        console.error('Código de autorização não fornecido');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Código de autorização não fornecido' }),
        };
    }

    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': process.env.DISCORD_CLIENT_ID,
                'client_secret': process.env.DISCORD_CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': process.env.DISCORD_REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Falha ao recuperar o token de acesso:', tokenResponse.status, tokenData);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Falha ao recuperar o token de acesso' }),
            };
        }

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            console.error('Falha ao recuperar dados do usuário:', userResponse.status, userData);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Falha ao recuperar dados do usuário' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: userData.id,
                username: userData.username,
                avatar: userData.avatar,
                access_token: tokenData.access_token,
            }),
        };
    } catch (error) {
        console.error('Erro na validação OAuth:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro na validação OAuth' }),
        };
    }
};