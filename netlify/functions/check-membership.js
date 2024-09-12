const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const { user_id, access_token } = JSON.parse(event.body);
    const serverId = process.env.DISCORD_SERVER_ID; // Variável armazenada no Netlify

    try {
        const response = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Erro na verificação de guildas' }),
            };
        }

        const guilds = await response.json();
        const isMember = guilds.some(guild => guild.id === serverId);

        if (!isMember) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Usuário não está no servidor' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuário verificado com sucesso' }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro no servidor' }),
        };
    }
};