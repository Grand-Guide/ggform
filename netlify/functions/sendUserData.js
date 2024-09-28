const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
    console.log('Iniciando a função sendUserData...');
    const userData = JSON.parse(event.body);
    console.log('Dados do usuário recebidos:', userData);

    const { discord_id, username, avatar } = userData;

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
                updated_at: new Date().toISOString()
            })
            .eq('discord_id', discord_id);

        if (updateError) {
            console.error('Erro ao atualizar usuário:', updateError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao atualizar usuário' }),
            };
        }
        console.log('Usuário atualizado com sucesso:', existingUser.discord_id);
    } else {
        const { error: insertError } = await supabase
            .from('users')
            .insert([{
                discord_id,
                username,
                avatar,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }]);

        if (insertError) {
            console.error('Erro ao inserir novo usuário:', insertError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao inserir novo usuário' }),
            };
        }
        console.log('Novo usuário inserido:', discord_id);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Dados do usuário processados com sucesso' }),
    };
};