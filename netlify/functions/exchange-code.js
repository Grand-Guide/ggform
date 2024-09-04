// functions/exchange-code.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { code } = JSON.parse(event.body);

  // Verifique se o código está presente
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Código não fornecido.' }),
    };
  }

  // Substitua pelos detalhes do seu OAuth2
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = 'https://ggform.netlify.app/callback.html';

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Você pode armazenar o token no banco de dados e verificar sua validade
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error || 'Erro ao trocar o código.' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno do servidor.' }),
    };
  }
};
