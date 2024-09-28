const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    console.log('Iniciando a função sendUserData...');
    
    let userData;
    try {
        userData = JSON.parse(event.body);
    } catch (error) {
        console.error('Erro ao parsear os dados do usuário:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Dados inválidos' }),
        };
    }

    console.log('Dados do usuário recebidos:', userData);

    const { discord_id, username, avatar } = userData;

    let existingUser;
    try {
        const { data, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', discord_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
        }

        existingUser = data || null;
    } catch (fetchError) {
        console.error('Erro ao buscar usuário existente:', fetchError);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar usuário existente' }),
        };
    }

    if (existingUser) {
        try {
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    username,
                    avatar,
                    updated_at: new Date().toISOString()
                })
                .eq('discord_id', discord_id);

            if (updateError) throw updateError;

            console.log('Usuário atualizado com sucesso:', existingUser.discord_id);
        } catch (updateError) {
            console.error('Erro ao atualizar usuário:', updateError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao atualizar usuário' }),
            };
        }
    } else {
        try {
            const { error: insertError } = await supabase
                .from('users')
                .insert([{
                    discord_id,
                    username,
                    avatar,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }]);

            if (insertError) throw insertError;

            console.log('Novo usuário inserido:', discord_id);
        } catch (insertError) {
            console.error('Erro ao inserir novo usuário:', insertError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao inserir novo usuário' }),
            };
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Dados do usuário processados com sucesso' }),
    };
};