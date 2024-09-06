// functions/check-auth.js
exports.handler = async (event) => {
    const authToken = event.headers.cookie && event.headers.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (!authToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Não autenticado' }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
};