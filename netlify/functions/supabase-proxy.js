const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const adminDiscordId = process.env.ADMIN_DISCORD_ID;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateToken(discordId, isAdmin = false) {
    return jwt.sign({ discord_id: discordId, is_admin: isAdmin }, JWT_SECRET, { expiresIn: '1h' });
}

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { username, avatar, discord_id } = JSON.parse(event.body);

        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*, is_banned')
            .eq('discord_id', discord_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw new Error('Erro ao buscar usuário existente');
        }

        if (existingUser) {
            if (existingUser.is_banned) {
                return {
                    statusCode: 403,
                    body: JSON.stringify({ message: 'Usuário banido', is_banned: true }),
                };
            }

            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username,
                    avatar,
                    updated_at: new Date(),
                })
                .eq('discord_id', discord_id);

            if (updateError) {
                throw new Error('Erro ao atualizar usuário');
            }

        } else {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        discord_id,
                        username,
                        avatar,
                        is_banned: false,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ]);

            if (insertError) {
                throw new Error('Erro ao inserir novo usuário');
            }
        }

        const token = generateToken(discord_id, discord_id === adminDiscordId);

        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': cookie.serialize('session', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60,
                    sameSite: 'Strict',
                    path: '/',
                }),
            },
            body: JSON.stringify({ message: 'Usuário autenticado com sucesso', is_banned: false }),
        };
    }

    if (event.httpMethod === 'GET') {
        const cookies = cookie.parse(event.headers.cookie || '');
        const token = cookies.session;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (!decoded.is_admin) {
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
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método não permitido' }),
    };
};