const cookie = require('cookie');

exports.handler = async (event) => {
    return {
        statusCode: 302,
        headers: {
            'Set-Cookie': cookie.serialize('userSession', '', { maxAge: -1 }),
            Location: '/'
        }
    };
};