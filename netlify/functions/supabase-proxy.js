// netlify/functions/supabase-proxy.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    const { username, avatar, discord_id } = JSON.parse(event.body);

    try {
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', discord_id)
            .single();

        if (fetchError) {
            console.error('Erro ao buscar usuário existente:', fetchError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao buscar usuário existente' }),
            };
        }

        if (existingUser) {
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username,
                    avatar,
                    updated_at: new Date(),
                })
                .eq('discord_id', discord_id);

            if (updateError) {
                console.error('Erro ao atualizar usuário:', updateError);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Erro ao atualizar usuário' }),
                };
            }
        } else {
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        discord_id,
                        username,
                        avatar,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                ]);

            if (insertError) {
                console.error('Erro ao inserir novo usuário:', insertError);
                return {
                    statusCode: 500,
                    body: JSON.stringify({ message: 'Erro ao inserir novo usuário' }),
                };
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuário processado com sucesso' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};