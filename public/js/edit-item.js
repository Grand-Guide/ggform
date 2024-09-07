document.addEventListener("DOMContentLoaded", function() {
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    const formContainer = document.getElementById('formContainer');
    const itemForm = document.getElementById('itemForm');
    let items = [];

    // Função para carregar os itens do JSON
    function loadItems() {
        fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json')
            .then(response => response.json())
            .then(data => {
                items = data; // Armazena os itens para uso posterior na pesquisa
            })
            .catch(err => {
                console.error("Erro ao carregar itens:", err);
            });
    }

    // Filtrar e exibir os resultados de pesquisa dinamicamente conforme o usuário digita
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = ''; // Limpa os resultados anteriores

        if (query) {
            const filteredItems = items.filter(item => item.name.toLowerCase().includes(query) || item.id.toString().includes(query));

            filteredItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.id} - ${item.name}`;
                li.addEventListener('click', () => loadItemForEdit(item)); // Função chamada ao clicar no item
                searchResults.appendChild(li);
            });
        }
    });

    // Função para carregar o item no formulário de edição
    function loadItemForEdit(item) {
        formContainer.style.display = 'block';
        searchResults.innerHTML = ''; // Limpa a lista de resultados de pesquisa
        searchBar.value = ''; // Limpa o campo de pesquisa
        document.getElementById('id').value = item.id; // Preenche o campo ID com o valor do item selecionado
        document.getElementById('name').value = item.name; // Preenche o campo Nome com o valor do item selecionado
    }

    // Inicializar carregamento dos itens
    loadItems();
});