const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            // Parse the incoming JSON data
            const data = JSON.parse(event.body);
            const { id, username, avatar } = data;

            // Webhook URL for the specific channel
            const webhookUrl = process.env.DISCORD_AUTH_URL;

            if (!webhookUrl) {
                throw new Error('Webhook URL not defined');
            }

            // Create the embed
            const embed = {
                content: '',
                embeds: [{
                    title: 'Novo Usuário Autorizado',
                    color: 0x00FF00, // Verde
                    fields: [
                        { name: 'ID do Usuário', value: id || 'Não fornecido', inline: true },
                        { name: 'Nome de Usuário', value: username || 'Não fornecido', inline: true },
                        { name: 'Avatar', value: avatar ? `[Link do Avatar](${avatar})` : 'Não fornecido', inline: false }
                    ],
                    thumbnail: {
                        url: avatar || 'https://example.com/default-avatar.png' // Use uma imagem padrão se o avatar não estiver disponível
                    }
                }]
            };

            // Send the embed to the Discord webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embed)
            });

            const responseBody = await response.text(); // Read response body for more information

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${responseBody}`);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Notificação enviada com sucesso!' })
            };
        } catch (error) {
            console.error('Error:', error);
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