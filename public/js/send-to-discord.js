document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('itemForm');

    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value : '';
        };

        const formType = getValue('formType');
        const data = {
            id: getValue('id'),
            name: getValue('name'),
            cover: getValue('cover'),
            description: getValue('description'),
            price: getValue('price'),
            update: getValue('update'),
            status: getValue('status'),
            quality: getValue('quality'),
            shop: getValue('shop'),
            hunting: getValue('hunting'),
            recipe: getValue('recipe'),
            videos: getValue('videos'),
            formType: formType,
            userId: getValue('userId'), // Adicione o ID do usuário
            username: getValue('username'), // Adicione o nome do usuário
            avatar: getValue('avatar') // Adicione o URL do avatar do usuário
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