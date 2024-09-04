// auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Função para verificar a autenticação
    function checkAuth() {
        // Tente obter um token de autenticação do cookie
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if (!token) {
            // Se não houver token, redirecione para a página de login
            window.location.href = '/';
        }
    }

    checkAuth();
});