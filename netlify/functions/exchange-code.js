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
  const guildId = process.env.DISCORD_GUILD_ID; // ID do servidor para adicionar o usuário

  try {
    // Troca do código por token de acesso
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
  
        const userInfo = await userInfoResponse.json();
  
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, userInfo }),
        };

    if (response.ok) {
      // Enviar informações para o canal via Webhook
      const userInfo = await fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      }).then(res => res.json());

      // Enviar informações do usuário para o Webhook
      // Enviar informações do usuário para o Webhook com Embed
await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeds: [
        {
          title: 'Novo Usuário Autenticado',
          color: 0x7289DA, // Cor do embed (hexadecimal)
          fields: [
            {
              name: 'ID do Usuário',
              value: userInfo.id,
              inline: true, // Deixar o campo inline
            },
            {
              name: 'Nome de Usuário',
              value: userInfo.username,
              inline: true,
            },
            {
              name: 'Email',
              value: userInfo.email || 'unknown',
            },
          ],
          thumbnail: {
            url: userInfo.avatar 
              ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
              : '/images/UnkAvatar.png', // Avatar padrão se não houver avatar
          },
          footer: {
            text: 'Autenticação via Discord OAuth2',
          },
          timestamp: new Date().toISOString(), // Timestamp do embed
        },
      ],
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
