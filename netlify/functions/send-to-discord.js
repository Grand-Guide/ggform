const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { 
                id, name, cover, description, price, update, status, quality, shop, 
                hunting, recipe, videos, formType, userId, username, avatar 
            } = JSON.parse(event.body);

            const webhookUrls = [
                process.env.DISCORD_WEBHOOK_URL_1,
                process.env.DISCORD_WEBHOOK_URL_2
            ];

            const userIdToUse = userId || event.queryStringParameters.userId || 'Não fornecido';
            const usernameToUse = username || event.queryStringParameters.username || 'Não fornecido';
            let avatarToUse = avatar || event.queryStringParameters.avatar || '';

            if (!avatarToUse) {
                avatarToUse = 'https://cdn.discordapp.com/embed/avatars/0.png';
            }

            const embed = {
                content: "",
                tts: false,
                embeds: [
                    {
                        id: 652627557,
                        title: `Sugestão de item ${formType === 'add' ? 'Adicionado' : 'Atualizado'}`,
                        description: "O pedido será revisado pela equipe responsável, Aguarde.",
                        color: formType === 'add' ? 0x00FF00 : 0xFF0000, // Verde para adição, vermelho para atualização
                        fields: [
                            { name: "ID", value: id, inline: true },
                            { name: "Nome", value: name, inline: true },
                            { name: "Descrição", value: description || 'Não fornecido', inline: false },
                            { name: "Preço", value: price || 'Não fornecido', inline: true },
                            { name: "Data de Atualização", value: update || 'Não fornecido', inline: true },
                            { name: "Status", value: status || 'Não fornecido', inline: true },
                            { name: "Qualidade", value: quality || 'Não fornecido', inline: true },
                            { name: "Loja", value: shop || 'Não fornecido', inline: true },
                            { name: "Caça", value: hunting || 'Não fornecido', inline: true },
                            { name: "Receita", value: recipe || 'Não fornecido', inline: true },
                            { name: "Vídeos", value: videos || 'Não fornecido', inline: true },
                            { name: "Imagem", value: cover ? `[Link da Imagem](${cover})` : 'Não fornecido', inline: false }
                        ],
                        author: {
                            name: "Grand Guide - Form",
                            icon_url: "https://cdn.discordapp.com/avatars/821793454577156127/40e1fcf3cb492d0924395d6388f73a02.webp?size=1024&format=webp&width=0&height=256"
                        },
                        url: "https://google.com",
                        thumbnail: {
                            url: "https://cdn-icons-png.flaticon.com/512/17568/17568020.png"
                        },
                        footer: {
                            icon_url: "https://cdn.discordapp.com/attachments/955735634662785044/1281899440176762930/cropped_image_1.png?ex=66dd6563&is=66dc13e3&hm=2c790c2b0df64eed7d72721b6639339c58580bf796c6fe9f5507c3a80d30ed73&",
                            text: "WebForm enviado hoje às"
                        },
                        timestamp: new Date().toISOString()
                    },
                    {
                        id: 386768945,
                        description: "",
                        fields: [
                            { name: "ID", value: userIdToUse, inline: true },
                            { name: "Nome", value: usernameToUse, inline: true }
                        ],
                        title: "UserInfo",
                        thumbnail: {
                            url: avatarToUse
                        }
                    }
                ],
                components: [],
                actions: {}
            };

            // Envio da solicitação para ambos os webhooks do Discord
            const promises = webhookUrls.map(webhookUrl =>
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(embed)
                })
            );

            // Aguarde todas as promessas serem resolvidas
            const responses = await Promise.all(promises);

            // Verifique se todos os responses foram bem-sucedidos
            for (const response of responses) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
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