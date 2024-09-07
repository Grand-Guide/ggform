// netlify/functions/notify-on-auth.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            // Parse the incoming JSON data
            const { id, username, avatar } = JSON.parse(event.body);

            // Webhook URL for the specific channel
            const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

            // Create the embed
            const embed = {
                content: '',
                embeds: [{
                    title: 'Novo Usuário Autorizado',
                    color: 0x00FF00, // Verde
                    fields: [
                        { name: 'ID do Usuário', value: id, inline: true },
                        { name: 'Nome de Usuário', value: username, inline: true },
                        { name: 'Avatar', value: `[Link do Avatar](${avatar})`, inline: false }
                    ],
                    thumbnail: {
                        url: avatar
                    }
                }]
            };

            // Send the embed to the Discord webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Notificação enviada com sucesso!' })
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: error.message })
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
};