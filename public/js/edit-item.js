document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    const formContainer = document.getElementById('formContainer');
    const editId = document.getElementById('editId');
    const editName = document.getElementById('editName');

    let items = [];

    // Carregar os itens do JSON
    function loadItems() {
        fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json')
            .then(response => response.json())
            .then(data => {
                items = data; // Armazena os itens para uso posterior na pesquisa
            });
    }

    // Filtra e exibe os resultados de pesquisa dinamicamente conforme o usuário digita
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = ''; // Limpa os resultados anteriores

        if (query) {
            const filteredItems = items.filter(item => item.name.toLowerCase().includes(query) || item.id.toString().includes(query)).slice(0, 8); // Limita a 8 resultados

            filteredItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.id} - ${item.name}`;
                li.addEventListener('click', () => loadItemForEdit(item));
                searchResults.appendChild(li);
            });
        }
    });

    // Função para carregar o item no formulário de edição
    function loadItemForEdit(item) {
        formContainer.style.display = 'block';
        document.getElementById('searchBar').style.display = 'none';
        document.getElementById('searchResults').style.display = 'none';
        editId.value = item.id;
        editName.value = item.name;
    }

    // Carregar os itens ao inicializar
    loadItems();
});