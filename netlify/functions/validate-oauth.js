const XataClient = require('@xata.io/client').XataClient;
const fetch = require('node-fetch');

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    database: process.env.XATA_DATABASE,
});

exports.handler = async (event) => {
    const { code } = event.queryStringParameters;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Código de autorização não fornecido' }),
        };
    }

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
        }),
    };
};