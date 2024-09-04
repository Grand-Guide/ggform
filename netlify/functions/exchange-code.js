// functions/exchange-code.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  let code;
  try {
    const body = JSON.parse(event.body);
    code = body.code;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Corpo da solicitação inválido. Certifique-se de enviar um JSON válido.' }),
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Código não fornecido.' }),
    };
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = 'https://ggform.netlify.app/callback.html';
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // Use variável de ambiente para o Webhook

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
      // Enviar informações para o canal via Webhook
      const userInfo = await fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      }).then(res => res.json());

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `Novo usuário autenticado:
          ID: ${userInfo.id}
          Nome: ${userInfo.username}
          Email: ${userInfo.email || 'Não fornecido'}
          Avatar: ${userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : 'Sem avatar'}`,
        }),
      });

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
