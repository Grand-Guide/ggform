// Função para verificar a autenticação
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userAvatar = localStorage.getItem('userAvatar');
    const loginPage = '/'; // Página de login
    const protectedPages = ['/src/pages/form.html']; // Páginas protegidas
    const currentPage = window.location.pathname;

    // Verifica se o usuário está autenticado
    if (!isAuthenticated) {
        if (protectedPages.includes(currentPage)) {
            window.location.href = loginPage; // Redireciona para a página de login se não estiver autenticado
        }
    } else {
        // Se autenticado, exibe o avatar e configura o logout
        displayUserAvatar(userAvatar);
    }
}

// Função para exibir o avatar do usuário e configurar o logout
function displayUserAvatar(userAvatar) {
    const avatarElement = document.querySelector('.avatar');

    if (avatarElement) {
        if (userAvatar) {
            avatarElement.style.backgroundImage = `url(${userAvatar})`;
        }

        avatarElement.addEventListener('click', () => {
            // Logout: remove dados de autenticação e redireciona para a página de login
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userAvatar');
            window.location.href = '/'; // Redireciona para a página de login
        });
    }
}

// Inicializa a verificação de autenticação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});
