const axios = require('axios');

exports.handler = async function(event, context) {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Code is required' })
        };
    }

    try {
        // Faz a solicitação ao Discord para trocar o código por um token
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://ggform.netlify.app/call-back' // Certifique-se que este URL corresponde ao configurado no Discord Developer Portal
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Se o código for válido, retornamos os dados do token
        const tokenData = response.data;

        // Enviar uma notificação para o canal do Discord com webhook
        const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userInfo = userInfoResponse.data;

        // Defina o payload do embed da notificação
        const embed = {
            embeds: [{
                title: "Novo Usuário Autorizado",
                color: 0x00FF00, // Cor verde
                fields: [
                    { name: "ID do Usuário", value: userInfo.id, inline: true },
                    { name: "Nome de Usuário", value: userInfo.username, inline: true },
                    { name: "Avatar", value: `[Link do Avatar](https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png)`, inline: false }
                ],
                thumbnail: { url: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` },
                timestamp: new Date().toISOString()
            }]
        };

        // Enviar o embed usando o webhook
        await axios.post(process.env.DISCORD_AUTH_URL, embed, {
            headers: { 'Content-Type': 'application/json' }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(tokenData)
        };

    } catch (error) {
        // Captura detalhes do erro
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to validate code',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};