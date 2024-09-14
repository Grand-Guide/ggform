const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            const { 
                id, name, cover, description, price, update, status, quality, shop, 
                hunting, recipe, videos, formType, userId, username, avatar, userImageLink
            } = JSON.parse(event.body);

            const webhookUrls = [
                process.env.DISCORD_WEBHOOK_URL_1,
                process.env.DISCORD_WEBHOOK_URL_2
            ];

            const userIdToUse = userId || event.queryStringParameters.userId || 'Não fornecido';
            const usernameToUse = username || event.queryStringParameters.username || 'Não fornecido';
            let avatarToUse = avatar || event.queryStringParameters.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
            
            // Lógica para definir a thumbnail
            const defaultThumbnailUrl = "https://cdn-icons-png.flaticon.com/512/17568/17568020.png"; // Imagem substituta
            let thumbnailUrl = defaultThumbnailUrl;

            if (userImageLink) {
                try {
                    // Verifica a extensão da imagem fornecida
                    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
                    const imageUrl = new URL(userImageLink);
                    const imageExtension = imageUrl.pathname.split('.').pop().toLowerCase();

                    if (validExtensions.includes(`.${imageExtension}`)) {
                        // Verifica se a imagem fornecida é acessível
                        const imageResponse = await fetch(userImageLink, { method: 'HEAD' });
                        if (imageResponse.ok) {
                            thumbnailUrl = userImageLink;
                        }
                    }
                } catch (error) {
                    // Se não for possível acessar o link ou extensão inválida, use a imagem substituta
                }
            }

            const embed1 = {
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
                            url: thumbnailUrl
                        },
                        footer: {
                            icon_url: "https://cdn.discordapp.com/attachments/955735634662785044/1281899440176762930/cropped_image_1.png?ex=66dd6563&is=66dc13e3&hm=2c790c2b0df64eed7d72721b6639339c58580bf796c6fe9f5507c3a80d30ed73&",
                            text: "WebForm enviado hoje às"
                        },
                        timestamp: new Date().toISOString()
                    }
                ],
                components: [],
                actions: {}
            };

            const embed2 = {
                content: "",
                tts: false,
                embeds: [
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

            // Envio da solicitação para os webhooks do Discord
            const response1 = await fetch(webhookUrls[0], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...embed1, embeds: [ ...embed1.embeds, ...embed2.embeds ] })
            });

            if (!response1.ok) {
                throw new Error('Network response was not ok for webhook 1');
            }

            const response2 = await fetch(webhookUrls[1], {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...embed1, embeds: [ ...embed1.embeds, ...embed2.embeds ] })
            });

            if (!response2.ok) {
                throw new Error('Network response was not ok for webhook 2');
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Mensagens enviadas com sucesso!' })
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