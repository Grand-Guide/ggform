document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userAvatar = localStorage.getItem('userAvatar');

    if (!isAuthenticated) {
        window.location.href = '/'; // Redirecionar para a página de login se não estiver autenticado
    }

    // Exibir o avatar do usuário
    const avatarElement = document.querySelector('.avatar');
    avatarElement.style.backgroundImage = `url(${userAvatar})`;

    const dropdownMenu = document.getElementById('dropdown-menu');

    avatarElement.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    document.getElementById('logout-link').addEventListener('click', (event) => {
        event.preventDefault();
        // Deslogar
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userAvatar');
        window.location.href = '/';
    });

    // Carregar categorias do arquivo JSON
    fetch('/netlify/functions/fetch-categories')
        .then(response => response.json())
        .then(data => {
            const categorySelect = document.getElementById('category');
            categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';

            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
            document.getElementById('category').innerHTML = '<option value="">Erro ao carregar categorias</option>';
        });
});