// netlify/functions/send-to-discord.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            // Parse the incoming JSON data
            const { id, name, cover, description, price, update, status, quality, shop, hunting, recipe, videos, formType, userId, username, avatar } = JSON.parse(event.body);

            // Webhook URL for the specific channel
            const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

            // Create the embeds
            const embeds = [
                {
                    title: `Item ${formType === 'add' ? 'Adicionado' : 'Atualizado'}`,
                    color: formType === 'add' ? 0x00FF00 : 0xFF0000, // Green for add, red for update
                    fields: [
                        { name: 'ID', value: id, inline: true },
                        { name: 'Nome', value: name, inline: true },
                        { name: 'Descrição', value: description || 'Não fornecido', inline: false },
                        { name: 'Preço', value: price || 'Não fornecido', inline: true },
                        { name: 'Data de Atualização', value: update || 'Não fornecido', inline: true },
                        { name: 'Status', value: status || 'Não fornecido', inline: true },
                        { name: 'Qualidade', value: quality || 'Não fornecido', inline: true },
                        { name: 'Loja', value: shop || 'Não fornecido', inline: true },
                        { name: 'Caça', value: hunting || 'Não fornecido', inline: true },
                        { name: 'Receita', value: recipe || 'Não fornecido', inline: true },
                        { name: 'Vídeos', value: videos || 'Não fornecido', inline: true },
                        { name: 'Imagem', value: cover ? `[Link da Imagem](${cover})` : 'Não fornecido', inline: false }
                    ]
                },
                {
                    title: 'Informações do Usuário',
                    color: 0x0000FF, // Blue color
                    fields: [
                        { name: 'ID do Usuário', value: userId, inline: true },
                        { name: 'Nome de Usuário', value: username, inline: true },
                        { name: 'Avatar', value: `[Link do Avatar](${avatar})`, inline: false }
                    ],
                    thumbnail: {
                        url: avatar
                    }
                }
            ];

            // Send the embed to the Discord webhook
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Mensagem enviada com sucesso!' })
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