const axios = require('axios');
const fetch = require('node-fetch'); // Usaremos fetch para enviar a notificação ao Discord

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
                redirect_uri: 'https://ggform.netlify.app/call-back'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Dados do token, incluindo access_token
        const tokenData = response.data;

        // Obtemos informações do usuário com o token obtido
        const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = userInfoResponse.data; // Dados do usuário

        // Envia uma notificação via webhook ao Discord
        await sendDiscordNotification({
            id: userData.id,
            username: userData.username,
            avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
        });

        // Retorna os dados do token ao cliente
        return {
            statusCode: 200,
            body: JSON.stringify(tokenData)
        };

    } catch (error) {
        // Se houver erro (como código inválido), retorna uma mensagem de erro
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to validate code' })
        };
    }
};

// Função para enviar notificação ao Discord via webhook
async function sendDiscordNotification({ id, username, avatar }) {
    const webhookUrl = process.env.DISCORD_AUTH_WEBHOOK_URL; // URL do webhook

    const embed = {
        content: '',
        embeds: [{
            title: 'Usuário Autenticado',
            color: 0x00FF00, // Verde
            fields: [
                { name: 'ID do Usuário', value: id, inline: true },
                { name: 'Nome de Usuário', value: username, inline: true },
                { name: 'Horário', value: new Date().toLocaleString(), inline: true },
                { name: 'Avatar', value: `[Clique aqui](${avatar})`, inline: false }
            ],
            thumbnail: {
                url: avatar // Exibe a imagem do avatar no embed
            }
        }]
    };

    // Envia o embed para o Discord
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(embed)
    });

    if (!response.ok) {
        throw new Error('Failed to send Discord notification');
    }
}