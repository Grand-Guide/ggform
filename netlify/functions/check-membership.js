const fetch = require('node-fetch');

exports.handler = async function(event) {
    const { user_id, access_token } = JSON.parse(event.body);

    const guildId = '819380036351688716';
    const discordApiUrl = `https://discord.com/api/v10/users/@me/guilds`;

    try {
        // Faz a requisição para pegar a lista de guildas do usuário
        const response = await fetch(discordApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro ao obter guildas:', errorText);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao obter guildas do usuário' })
            };
        }

        const guilds = await response.json();
        console.log('Guildas do usuário:', guilds); // Adicione esta linha para depuração

        // Verifica se o usuário faz parte do seu servidor específico
        const isMember = guilds.some(guild => guild.id === guildId);

        if (isMember) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Usuário está no servidor' })
            };
        } else {
            return {
                statusCode: 403, // Acesso negado
                body: JSON.stringify({ message: 'Usuário não está no servidor' })
            };
        }

    } catch (error) {
        console.error('Erro ao verificar o servidor:', error.message); // Adicione esta linha para depuração
        return {
            statusCode: 500, // Erro interno do servidor
            body: JSON.stringify({ message: 'Erro ao verificar o servidor', error: error.message })
        };
    }
};