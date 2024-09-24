const { XataClient } = require('@xata.io/client');

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    database: process.env.XATA_DATABASE_URL,
});

exports.handler = async function(event, context) {
    try {
        const userData = {
            username: 'Nome do Usuário',
            id: '123456789',
            avatar: 'avatar_id',
            avatar_extension: '.png',
            serverStatus: 'Membro',
            totalContributions: 10,
            acceptedContributions: 5,
            totalSubmitted: 8,
            totalAccepted: 4
        };

        await xata.db.profileAccess.create({
            userId: userData.id,
            timestamp: new Date().toISOString()
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };
    } catch (error) {
        console.error('Erro ao recuperar dados do perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao recuperar dados do perfil' })
        };
    }
};