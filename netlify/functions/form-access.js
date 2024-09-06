const fetch = require('node-fetch');
const cookie = require('cookie');

exports.handler = async (event) => {
    const cookies = cookie.parse(event.headers.cookie || '');
    const userToken = cookies.userToken;

    if (!userToken) {
        return {
            statusCode: 302,
            headers: {
                Location: '/'
            },
            body: 'Redirecting to login...'
        };
    }

    try {
        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Invalid token');
        }

        // Renderize ou redirecione para a página do formulário
        return {
            statusCode: 200,
            body: 'Formulário carregado com sucesso!'
        };
    } catch (error) {
        return {
            statusCode: 302,
            headers: {
                Location: '/'
            },
            body: 'Redirecting to login...'
        };
    }
};