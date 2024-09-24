const redirectToDiscord = (event, context, callback) => {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    
    const scopes = 'identify';
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
    
    const response = {
        statusCode: 302,
        headers: {
            Location: discordAuthUrl,
        },
    };

    callback(null, response);
};

exports.handler = redirectToDiscord;