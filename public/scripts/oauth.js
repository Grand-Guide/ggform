document.getElementById("itemForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const itemData = {
        name: document.getElementById("name").value,
        cover: document.getElementById("cover").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
    };

    // Exemplo de envio para o Discord via webhook
    fetch("https://discord.com/api/webhooks/SEU_WEBHOOK", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            embeds: [
                {
                    title: itemData.name,
                    description: itemData.description,
                    fields: [
                        { name: "Preço", value: itemData.price, inline: true },
                        { name: "Imagem", value: itemData.cover, inline: true }
                    ],
                    image: { url: itemData.cover }
                }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Item enviado para aprovação no Discord!");
    })
    .catch((error) => {
        console.error("Erro ao enviar para o Discord:", error);
    });
});

// Botão de logout
document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = '/logout';
});