document.addEventListener("DOMContentLoaded", function() {
    const authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
        window.location.href = '/'; // Redireciona para a página de login
    }
});