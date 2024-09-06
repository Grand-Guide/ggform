document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    if (authButton) {
        authButton.addEventListener('click', () => {
            window.location.href = 'https://ggform.netlify.app/callback.html'; // Substitua pelo URL correto
        });
    } else {
        console.error('Botão de autenticação não encontrado.');
    }
});