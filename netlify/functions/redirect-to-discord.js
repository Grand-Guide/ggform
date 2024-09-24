const { parse } = require('querystring');

exports.handler = (event, context) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = 'https://ggform.netlify.app/call-back';
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20guilds`;
    
    return {
        statusCode: 302,
        headers: {
            Location: discordAuthUrl,
        },
        body: null,
    };
};