// functions/exchange-code.js
const fetch = require('node-fetch');

// Função para converter o ID Snowflake em data
function snowflakeToDate(snowflake) {
  const timestamp = (snowflake >> 22) + 1420070400000; // Data inicial do Snowflake
  return new Date(timestamp);
}

// Mapeamento de flags para URLs de imagens
const flagImages = {
  1: 'https://static.wikia.nocookie.net/discord/images/9/95/DiscordPartnerBadge.svg/revision/latest?cb=20220807112925',
  2: 'https://static.wikia.nocookie.net/discord/images/c/c4/HypeSquad_Event_Badge.png/revision/latest?cb=20210804155645',
  4: 'https://static.wikia.nocookie.net/discord/images/0/08/Bug_hunter_badge.png/revision/latest/scale-to-width-down/25?cb=20210611054806',
  8: 'https://static.wikia.nocookie.net/discord/images/3/31/Hypesquad_bravery_badge.png/revision/latest/scale-to-width-down/25?cb=20210611054025',
  16: 'https://static.wikia.nocookie.net/discord/images/2/27/Hypesquad_brilliance_badge.png/revision/latest/scale-to-width-down/25?cb=20210611054026',
  32: 'https://static.wikia.nocookie.net/discord/images/c/ca/Hypesquad_balance_badge.png/revision/latest/scale-to-width-down/25?cb=20210611054027',
  64: 'https://static.wikia.nocookie.net/discord/images/7/70/Early_supporter_badge.png/revision/latest/scale-to-width-down/25?cb=20210611053519',
  128: 'https://static.wikia.nocookie.net/discord/images/8/8b/Discord-staff.png/revision/latest/scale-to-width-down/25?cb=20221111200951',
  256: 'https://static.wikia.nocookie.net/discord/images/0/07/Verified_developer_badge.png/revision/latest/scale-to-width-down/25?cb=20210611053520',
  512: 'https://static.wikia.nocookie.net/discord/images/e/e6/Bug_buster_badge.png/revision/latest/scale-to-width-down/25?cb=20210611054804',
  1024: 'https://static.wikia.nocookie.net/discord/images/0/07/Verified_developer_badge.png/revision/latest/scale-to-width-down/25?cb=20210611053520',
};

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

    if (response.ok) {
      // Obter informações do usuário
      const userInfo = await fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      }).then(res => res.json());

      // Converter ID Snowflake para data de criação
      const creationDate = snowflakeToDate(BigInt(userInfo.id));

      // Decodificar flags
      const userFlags = [];
      for (const [flagValue, imageUrl] of Object.entries(flagImages)) {
        if (userInfo.flags & flagValue) {
          userFlags.push(imageUrl);
        }
      }

      // Enviar informações do usuário para o Webhook
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
                  inline: true,
                },
                {
                  name: 'Nome de Usuário',
                  value: userInfo.username,
                  inline: true,
                },
                {
                  name: 'Flags',
                  value: userFlags.length ? userFlags.join('\n') : 'Nenhuma',
                  inline: false,
                },
                {
                  name: 'Data de Criação',
                  value: creationDate.toISOString(),
                  inline: true,
                },
              ],
              thumbnail: {
                url: userInfo.avatar 
                  ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`
                  : '/images/UnkAvatar.png',
              },
              footer: {
                text: 'Autenticação via Discord OAuth2',
              },
              timestamp: new Date().toISOString(),
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