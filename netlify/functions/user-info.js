const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Simulação da obtenção do token do usuário armazenado na sessão
    const userToken = event.headers.authorization; // Ajuste conforme sua implementação de autenticação

    if (!userToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Token não fornecido' })
        };
    }

    try {
        // Obtenha informações do usuário do Discord usando o token
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Erro ao obter informações do usuário do Discord');
        }

        const userData = await userResponse.json();
        const avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;

        return {
            statusCode: 200,
            body: JSON.stringify({ avatarUrl })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};