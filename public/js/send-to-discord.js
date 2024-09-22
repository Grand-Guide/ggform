document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('itemForm');

    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : '';
        };

        const authToken = sessionStorage.getItem('authToken');
        if (!authToken) {
            alert('Você precisa estar autenticado para enviar os dados.');
            return;
        }

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
            userId: '',
            username: '',
            avatar: ''
        };

        // Validação
        if (!data.name || !data.id) {
            alert('Nome e ID do item são obrigatórios.');
            return;
        }

        try {
            const response = await fetch('/.netlify/functions/send-to-discord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Falha ao enviar os dados. Tente novamente mais tarde.');
            }

            const result = await response.json();
            console.log('Success:', result);
            showNotification();
        } catch (error) {
            console.error('Error:', error);
            alert('Ocorreu um erro: ' + error.message);
        }
    });

    function showNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '0';
        notification.style.width = '100%';
        notification.style.height = '100%';
        notification.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        notification.style.display = 'flex';
        notification.style.flexDirection = 'column';
        notification.style.justifyContent = 'center';
        notification.style.alignItems = 'center';
        notification.style.zIndex = '1000';
        notification.innerHTML = `
            <h2>Item ${formType === 'add' ? 'adicionado' : 'atualizado'} com sucesso!</h2>
            <a href="https://discord.gg/GQx5MpX7cA" class="button" style="margin: 10px; padding: 10px 20px; background-color: #292C34; color: #fff; border-radius: 5px; text-decoration: none;">Entrar no Servidor Discord</a>
            <a href="/protected.html" class="button" style="margin: 10px; padding: 10px 20px; background-color: #292C34; color: #fff; border-radius: 5px; text-decoration: none;">Voltar</a>
        `;
        document.body.appendChild(notification);
    }
});