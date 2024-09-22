const fetch = require('node-fetch');
const admin = require('firebase-admin');

const databaseURL = `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`;
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: databaseURL
});

const db = admin.firestore();

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

        await db.collection('membershipChecks').add({
            user_id: user_id,
            isMember,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
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