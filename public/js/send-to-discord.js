// public/js/send-to-discord.js
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('itemForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formType = document.getElementById('formType').value;
        const data = {
            id: document.getElementById('id').value,
            name: document.getElementById('name').value,
            cover: document.getElementById('cover').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value,
            update: document.getElementById('update').value,
            status: document.getElementById('status').value,
            quality: document.getElementById('quality').value,
            shop: document.getElementById('shop').value,
            hunting: document.getElementById('hunting').value,
            recipe: document.getElementById('recipe').value,
            videos: document.getElementById('videos').value
        };

        const embed = {
            content: `Novo item ${formType === 'add' ? 'adicionado' : 'atualizado'}`,
            embeds: [{
                title: `Item ${formType === 'add' ? 'Adicionado' : 'Atualizado'}`,
                color: formType === 'add' ? 0x00FF00 : 0xFF0000, // Verde para adição, vermelho para atualização
                fields: [
                    { name: 'ID', value: data.id, inline: true },
                    { name: 'Nome', value: data.name, inline: true },
                    { name: 'Descrição', value: data.description || 'Não fornecido', inline: false },
                    { name: 'Preço', value: data.price || 'Não fornecido', inline: true },
                    { name: 'Data de Atualização', value: data.update || 'Não fornecido', inline: true },
                    { name: 'Status', value: data.status || 'Não fornecido', inline: true },
                    { name: 'Qualidade', value: data.quality || 'Não fornecido', inline: true },
                    { name: 'Loja', value: data.shop || 'Não fornecido', inline: true },
                    { name: 'Caça', value: data.hunting || 'Não fornecido', inline: true },
                    { name: 'Receita', value: data.recipe || 'Não fornecido', inline: true },
                    { name: 'Vídeos', value: data.videos || 'Não fornecido', inline: true },
                    { name: 'Imagem', value: data.cover ? `[Link da Imagem](${data.cover})` : 'Não fornecido', inline: false }
                ]
            }]
        };

        fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            showNotification(); // Exibir notificação
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function showNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '0';
        notification.style.width = '100%';
        notification.style.height = '100%';
        notification.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        notification.style.display = 'flex';
        notification.style.flexDirection = 'column';
        notification.style.justifyContent = 'center';
        notification.style.alignItems = 'center';
        notification.style.zIndex = '1000';
        notification.innerHTML = `
            <h2>Item ${formType === 'add' ? 'adicionado' : 'atualizado'} com sucesso!</h2>
            <a href="https://discord.gg/GQx5MpX7cA" class="button" style="margin: 10px;">Entrar no Servidor Discord</a>
            <a href="/protected.html" class="button" style="margin: 10px;">Voltar</a>
        `;
        document.body.appendChild(notification);
    }
});