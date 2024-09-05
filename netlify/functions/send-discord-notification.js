const fetch = require('node-fetch');

// Função para enviar ou atualizar uma mensagem no Discord
async function sendOrUpdateWebhook(webhookUrl, messageId, status, color, description) {
  const body = JSON.stringify({
    embeds: [
      {
        title: 'Status do Deploy',
        description: description,
        color: color,
        timestamp: new Date().toISOString(),
      },
    ],
  });

  try {
    if (messageId) {
      // Atualiza a mensagem existente
      await fetch(`${webhookUrl}/messages/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
    } else {
      // Envia uma nova mensagem
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      const data = await response.json();
      return data.id; // Retorna a ID da mensagem para atualizações futuras
    }
  } catch (err) {
    console.error('Erro ao enviar notificação:', err);
  }
}

exports.handler = async function(event, context) {
  const webhookUrl = process.env.DEV_NOTIFICATION;
  const status = event.queryStringParameters.status;
  const messageId = event.queryStringParameters.messageId;

  let description;
  let color;

  // Define o status e a cor de acordo com a etapa
  switch (status) {
    case 'initializing':
      description = 'Deploy iniciado...';
      color = 0xFFFF00;
      break;
    case 'building':
      description = 'Construindo o projeto...';
      color = 0xFFFF00;
      break;
    case 'deploying':
      description = 'Enviando para produção...';
      color = 0xFFFF00;
      break;
    case 'cleanup':
      description = 'Limpando...';
      color = 0xFFFF00;
      break;
    case 'post-processing':
      description = 'Processamento final...';
      color = 0xFFFF00;
      break;
    case 'success':
      description = 'Deploy concluído com sucesso!';
      color = 0x00FF00;
      break;
    case 'failure':
      description = 'Erro durante o deploy.';
      color = 0xFF0000;
      break;
    default:
      description = 'Status desconhecido.';
      color = 0xCCCCCC;
  }

  const messageIdReturned = await sendOrUpdateWebhook(webhookUrl, messageId, status, color, description);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, messageId: messageIdReturned }),
  };
};