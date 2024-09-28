// netlify/functions/sendUserData.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL; // Acesse a variável de ambiente
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use a chave de serviço
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    console.log("Iniciando a função sendUserData...");

    if (event.httpMethod !== 'POST') {
        console.error('Método não permitido');
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    let userData;
    try {
        userData = JSON.parse(event.body);
        console.log("Dados do usuário recebidos:", userData);
    } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Dados inválidos' }),
        };
    }

    const { data, error } = await supabase
        .from('users')
        .insert([userData]); // Insira os dados do usuário

    if (error) {
        console.error('Erro ao inserir dados no Supabase:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }

    console.log('Dados inseridos com sucesso:', data);
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};