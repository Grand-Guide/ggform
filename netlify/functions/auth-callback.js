const fetch = require('node-fetch');
const cookie = require('cookie');

exports.handler = async (event) => {
    const code = event.queryStringParameters.code;

    const data = {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://ggform.netlify.app/form',
        scope: 'identify guilds.join'
    };

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    });

    const tokenInfo = await response.json();

    const userInfo = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`
        }
    });

    const user = await userInfo.json();

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000
    };

    return {
        statusCode: 302,
        headers: {
            'Set-Cookie': cookie.serialize('userSession', JSON.stringify(user), cookieOptions),
            Location: '/form'
        }
    };
};