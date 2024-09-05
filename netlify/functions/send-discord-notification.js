const fetch = require('node-fetch');

let messageId = null; // Armazena o ID da mensagem para atualizações

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
  
  // Define o status e a cor de acordo com a etapa
  let description;
  let color;

  switch (status) {
    case 'initializing':
      description = 'Deploy iniciado...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'building':
      description = 'Construindo o projeto...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'deploying':
      description = 'Enviando para produção...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'cleanup':
      description = 'Limpando...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'post-processing':
      description = 'Processamento final...';
      color = 0xFFFF00; // Amarelo
      break;
    case 'success':
      description = 'Deploy concluído com sucesso!';
      color = 0x00FF00; // Verde
      break;
    case 'failure':
      description = 'Erro durante o deploy.';
      color = 0xFF0000; // Vermelho
      break;
    default:
      description = 'Status desconhecido.';
      color = 0xCCCCCC; // Cinza
  }

  // Enviar ou atualizar a mensagem no Discord
  messageId = await sendOrUpdateWebhook(webhookUrl, messageId, status, color, description);

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, messageId }),
  };
};
