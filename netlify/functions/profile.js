// profile.js
exports.handler = async function(event, context) {
    try {
        // Dados simulados para exemplo. Substitua com dados reais conforme necessário.
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

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao recuperar dados do perfil' })
        };
    }
};