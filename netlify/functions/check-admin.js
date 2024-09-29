const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const adminDiscordId = process.env.ADMIN_DISCORD_ID;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    const cookies = cookie.parse(event.headers.cookie || '');
    const token = cookies.session;

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Não autorizado' }),
        };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.discord_id !== adminDiscordId) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Acesso negado. Você não tem permissão para acessar esta página.' }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ discord_id: decoded.discord_id }),
        };
    } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Token inválido ou expirado' }),
        };
    }
};