const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    console.log('Iniciando a função sendUserData...');
    
    try {
        const userData = JSON.parse(event.body);
        console.log('Dados do usuário recebidos:', userData);

        const { discord_id, username, avatar } = userData;

        const { data, error } = await supabase
            .from('users')
            .insert([
                { discord_id, username, avatar }
            ]);

        if (error) {
            console.error('Erro ao inserir dados no Supabase:', error);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Erro ao inserir dados' }),
            };
        }

        console.log('Usuário inserido com sucesso:', data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuário inserido com sucesso', user: data }),
        };
    } catch (err) {
        console.error('Erro na função:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor' }),
        };
    }
};