// functions/send-discord-notification.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const webhookUrl = process.env.DEV_NOTIFICATION; // Usa a variável de ambiente

  const deployStatus = 'success';

  let color;
  let description;

  switch (deployStatus) {
    case 'success':
      color = 0x00FF00;
      description = 'O deploy foi concluído com sucesso!';
      break;
    case 'failure':
      color = 0xFF0000;
      description = 'Ocorreu um erro durante o deploy.';
      break;
    case 'warning':
      color = 0xFFFF00;
      description = 'Houve um problema durante o deploy.';
      break;
    default:
      color = 0xCCCCCC;
      description = 'Status do deploy desconhecido.';
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: 'Notificação de Deploy',
            description: description,
            color: color,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao enviar notificação.' }),
    };
  }
};