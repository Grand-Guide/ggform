// netlify/functions/send-to-discord.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { id, name, cover, description, price, update, status, quality, shop, hunting, recipe, videos, formType } = JSON.parse(event.body);
            
            const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // URL do webhook definida como variável de ambiente

            const embed = {
                content: `Novo item ${formType === 'add' ? 'adicionado' : 'atualizado'}`,
                embeds: [{
                    title: `Item ${formType === 'add' ? 'Adicionado' : 'Atualizado'}`,
                    color: formType === 'add' ? 0x00FF00 : 0xFF0000, // Verde para adição, vermelho para atualização
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
                }]
            };

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