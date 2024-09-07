document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('itemForm');
    const formType = document.getElementById('formType').value; // Adiciona um campo oculto para o tipo de formulário
    const webhookURL = process.env.DISCORD_WEBHOOK_URL; // Usa a variável de ambiente

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            id: formData.get('id'),
            name: formData.get('name'),
            cover: formData.get('cover'),
            description: formData.get('description'),
            price: formData.get('price'),
            update: formData.get('update'),
            status: formData.get('status'),
            quality: formData.get('quality'),
            shop: formData.get('shop'),
            hunting: formData.get('hunting'),
            recipe: formData.get('recipe'),
            videos: formData.get('videos'),
        };

        const embed = {
            title: formType === 'add' ? 'Novo Item Adicionado' : 'Item Atualizado',
            color: formType === 'add' ? 3066993 : 15844367, // Azul para adição, vermelho para atualização
            fields: [
                { name: 'ID', value: data.id },
                { name: 'Nome', value: data.name },
                { name: 'Descrição', value: data.description },
                { name: 'Preço', value: data.price },
                { name: 'Atualização', value: data.update },
                { name: 'Status', value: data.status },
                { name: 'Qualidade', value: data.quality },
                { name: 'Loja', value: data.shop },
                { name: 'Caça', value: data.hunting },
                { name: 'Receita', value: data.recipe },
                { name: 'Vídeos', value: data.videos }
            ],
            footer: { text: 'Atualização de Itens' }
        };

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed] })
        }).then(response => {
            if (response.ok) {
                alert('Dados enviados com sucesso!');
                form.reset();
            } else {
                alert('Erro ao enviar os dados.');
            }
        }).catch(error => {
            console.error('Erro:', error);
            alert('Erro ao enviar os dados.');
        });
    });
});