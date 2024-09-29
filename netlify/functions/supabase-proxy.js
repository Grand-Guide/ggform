const { createClient } = require('@supabase/supabase-js');
const cookie = require('cookie');

exports.handler = async (event) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (event.httpMethod === 'POST') {
        const { username, avatar, discord_id } = JSON.parse(event.body);

        try {
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
                    .insert([{
                        discord_id,
                        username,
                        avatar,
                        is_banned: false,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }]);

                if (insertError) {
                    throw new Error('Erro ao inserir novo usuário');
                }
            }

            // Configura o cookie de sessão
            return {
                statusCode: 200,
                headers: {
                    'Set-Cookie': cookie.serialize('session', discord_id, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24, // 1 dia
                        sameSite: 'Strict',
                        path: '/',
                    }),
                },
                body: JSON.stringify({ message: 'Usuário autenticado com sucesso', is_banned: existingUser ? existingUser.is_banned : false }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Método não permitido' }),
    };
};