const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { code } = event.queryStringParameters;

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
            body: JSON.stringify({ error: 'Failed to retrieve access token' }),
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
            body: JSON.stringify({ error: 'Failed to retrieve user data' }),
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
