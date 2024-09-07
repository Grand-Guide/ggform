document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('itemForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

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
            videos: document.getElementById('videos').value,
            formType: formType
        };

        fetch('/.netlify/functions/send-to-discord', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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