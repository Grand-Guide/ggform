const { XataClient } = require('@xata.io/client');

exports.handler = async (event) => {
    console.log('Iniciando validação OAuth...');

    const code = event.queryStringParameters.code;

    if (!code) {
        console.error('Código de autorização não fornecido.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Código de autorização não fornecido.' }),
        };
    }

    try {
        console.log('Código de autorização recebido:', code);
        
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
            }),
        });

        const tokenData = await tokenResponse.json();
        console.log('Token obtido com sucesso:', tokenData);

        if (!tokenResponse.ok) {
            console.error('Falha ao obter o token:', tokenData);
            return {
                statusCode: tokenResponse.status,
                body: JSON.stringify({ error: 'Falha ao obter o token de acesso.' }),
            };
        }
        const xata = new XataClient({
            apiKey: process.env.XATA_API_KEY,
            database: process.env.XATA_DATABASE,
        });
        console.log('Cliente Xata instanciado com sucesso.');

        const userResponse = await xata.db.users.create({
            data: {
                accessToken: tokenData.access_token,
            },
        });

        console.log('Usuário salvo com sucesso:', userResponse);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error('Erro na validação OAuth:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro interno do servidor.' }),
        };
    }
};