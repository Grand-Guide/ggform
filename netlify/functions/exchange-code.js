const fetch = require('node-fetch');

// Armazenamento em memória para fins de demonstração; use uma base de dados para produção.
let codes = {}; // Armazena o código com informações de validade.

const EXPIRATION_TIME_MS = 15 * 60 * 1000; // 15 minutos em milissegundos.

exports.handler = async function(event, context) {
    const { code } = JSON.parse(event.body);
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = 'https://ggform.netlify.app/callback.html';

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Código não fornecido.' }),
        };
    }

    const codeData = codes[code];
    
    if (codeData) {
        // Verifica se o código expirou
        const currentTime = new Date().getTime();
        if (currentTime - codeData.timestamp > EXPIRATION_TIME_MS) {
            delete codes[code]; // Remove o código expirado
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Código expirado.' }),
            };
        }
        
        // Código válido, então remove o código para que não seja usado novamente
        delete codes[code];
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Código inválido.' }),
        };
    }

    try {
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'client_id': clientId,
                'client_secret': clientSecret,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirectUri,
            }),
        });

        const data = await response.json();
        if (data.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: data.error_description }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};

// Função para criar um novo código e armazená-lo
function createCode(code) {
    codes[code] = {
        timestamp: new Date().getTime(),
    };
}

// Exemplo de criação de código para fins de demonstração
// Isso deve ser feito em outro ponto do seu código, por exemplo, quando o código é gerado inicialmente
// createCode('example-code'); // Substitua 'example-code' pelo código real gerado
