const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.handler = async function(event, context) {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Code is required' })
        };
    }

    try {
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://ggform.netlify.app/call-back' 
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const tokenData = response.data;

        const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userInfo = userInfoResponse.data;

        // Enviar uma notificação para o canal do Discord com webhook (opcional)
        const embed = {
            embeds: [{
                title: "Novo Usuário Autorizado",
                color: 0x00FF00, 
                fields: [
                    { name: "ID do Usuário", value: userInfo.id, inline: true },
                    { name: "Nome de Usuário", value: userInfo.username, inline: true },
                    { name: "Avatar", value: `[Link do Avatar](https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png)`, inline: false }
                ],
                thumbnail: { url: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` },
                timestamp: new Date().toISOString()
            }]
        };

        await axios.post(process.env.DISCORD_AUTH_URL, embed, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Retorna as informações do usuário junto com o access_token
        return {
            statusCode: 200,
            body: JSON.stringify({
                access_token: tokenData.access_token,
                user: {
                    id: userInfo.id,
                    username: userInfo.username,
                    avatar: userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : null 
                }
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to validate code',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};