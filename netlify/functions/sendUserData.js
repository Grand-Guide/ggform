const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.handler = async (event) => {
    console.log('Iniciando a função sendUserData...');

    try {
        const userData = JSON.parse(event.body);
        console.log('Dados do usuário recebidos:', userData);

        const { discord_id, username, avatar } = userData;

        if (!discord_id) {
            console.error('Erro: discord_id é obrigatório.');
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'discord_id é obrigatório' }),
            };
        }

        const { data, error } = await supabase
            .from('users')
            .insert([{ discord_id, username, avatar }]);

        if (error) {
            console.error('Erro ao inserir dados no Supabase:', error);
            return {
                statusCode: 500,
                body: JSON.stringify(error),
            };
        }

        console.log('Usuário inserido com sucesso:', data);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuário inserido com sucesso!', data }),
        };
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor', error }),
        };
    }
};