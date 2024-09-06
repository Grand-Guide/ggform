const cookie = require('cookie');

exports.handler = async (event) => {
    const cookies = cookie.parse(event.headers.cookie || '');
    const userSession = cookies.userSession ? JSON.parse(cookies.userSession) : null;

    if (!userSession || !userSession.id) {
        return {
            statusCode: 302,
            headers: {
                Location: '/'
            }
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Usuário autenticado' })
    };
};