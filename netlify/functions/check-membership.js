const fetch = require('node-fetch');
const { XataClient } = require('@xata.io/client');
require('dotenv').config();

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    databaseUrl: process.env.XATA_DATABASE_URL
});

exports.handler = async function(event) {
    const { user_id, access_token } = JSON.parse(event.body);
    const guildId = '819380036351688716';
    const discordApiUrl = `https://discord.com/api/v10/users/@me/guilds`;

    try {
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
        console.log('Guildas do usuário:', guilds);

        const isMember = guilds.some(guild => guild.id === guildId);

        await xata.db.membershipChecks.create({
            user_id: user_id,
            isMember: isMember,
            timestamp: new Date().toISOString()
        });

        if (isMember) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Usuário está no servidor' })
            };
        } else {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Usuário não está no servidor' })
            };
        }

    } catch (error) {
        console.error('Erro ao verificar o servidor:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao verificar o servidor', error: error.message })
        };
    }
};