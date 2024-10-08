const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.handler = async (event) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const cookies = cookie.parse(event.headers.cookie || '');
    const token = cookies.session;

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Token não encontrado. Você não está logado.' }),
        };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const discord_id = decoded.discord_id;

        const { data: user, error } = await supabase
            .from('users')
            .select('discord_id, username, avatar, is_banned')
            .eq('discord_id', discord_id)
            .single();

        if (error) {
            throw new Error('Erro ao buscar o usuário');
        }

        if (user.is_banned) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Usuário banido' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};