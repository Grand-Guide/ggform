document.getElementById("itemForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const itemData = {
        id: document.getElementById("id").value,
        name: document.getElementById("name").value,
        cover: document.getElementById("cover").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        update: document.getElementById("update").value,
        status: document.getElementById("status").value,
        quality: document.getElementById("quality").value,
        shop: document.getElementById("shop").value,
        hunting: document.getElementById("hunting").value,
        recipe: document.getElementById("recipe").value,
        videos: document.getElementById("videos").value,
    };

    fetch('/.netlify/functions/send-to-discord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || 'Item enviado para aprovação no Discord!');
    })
    .catch((error) => {
        console.error("Erro ao enviar para o Discord:", error);
    });
});

// Botão de logout
document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = '/netlify/functions/logout';
});

// Configurar ícone do usuário
document.addEventListener("DOMContentLoaded", function () {
    fetch('/netlify/functions/user-info', {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('userToken')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("userIcon").src = data.avatarUrl;
    })
    .catch((error) => {
        console.error("Erro ao carregar o ícone do usuário:", error);
    });
});