const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { name, cover, description, price } = JSON.parse(event.body);

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [
                    {
                        title: name,
                        description: description,
                        fields: [
                            { name: "Preço", value: price, inline: true },
                            { name: "Imagem", value: cover, inline: true }
                        ],
                        image: { url: cover }
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar para o Discord');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item enviado para aprovação no Discord!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};