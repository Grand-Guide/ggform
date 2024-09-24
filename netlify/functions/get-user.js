const xata = require('xata'); 

exports.handler = async (event) => {
    const authToken = event.headers.Authorization?.split(' ')[1];

    if (!authToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Token de autenticação ausente.' }),
        };
    }

    const userId = await validateToken(authToken);
    if (!userId) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Token inválido.' }),
        };
    }

    try {
        const userRecord = await xata.db.users.filter({ id: userId }).getFirst();
        if (!userRecord) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Usuário não encontrado.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ userId: userRecord.id, username: userRecord.username }),
        };
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar dados do usuário.' }),
        };
    }
};
async function validateToken(token) {
}