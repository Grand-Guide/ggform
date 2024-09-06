const fetch = require('node-fetch');
const querystring = require('querystring');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const { code } = event.queryStringParameters;
    
    if (!code) {
        return {
            statusCode: 400,
            body: 'Missing authorization code',
        };
    }

    // Trocar o código de autorização por um token
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'https://ggform.netlify.app/auth-callback',
            scope: 'identify',
        }),
    });

    if (!tokenResponse.ok) {
        return {
            statusCode: 400,
            body: 'Failed to exchange code for token',
        };
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Obter informações do usuário
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!userResponse.ok) {
        return {
            statusCode: 400,
            body: 'Failed to fetch user info',
        };
    }

    const userData = await userResponse.json();

    // Redirecionar para o formulário com o token de usuário
    return {
        statusCode: 302,
        headers: {
            Location: `/form?code=${code}&avatar=${userData.avatar}&username=${userData.username}`,
        },
        body: '',
    };
};