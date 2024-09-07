const axios = require('axios');

exports.handler = async function(event, context) {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Code is required' })
        };
    }

    try {
        // Faz a solicitação ao Discord para trocar o código por um token
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://ggform.netlify.app/call-back'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        // Se o código for válido, retornamos os dados do token
        const tokenData = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify(tokenData)
        };

    } catch (error) {
        // Se houver erro (como código inválido), retorna uma mensagem de erro
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to validate code' })
        };
    }
};