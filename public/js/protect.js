document.addEventListener("DOMContentLoaded", function() {
    const addItemBtn = document.getElementById('addItemBtn');
    const editItemBtn = document.getElementById('editItemBtn');
    const formContainer = document.getElementById('formContainer');
    const searchContainer = document.getElementById('searchContainer');
    const itemForm = document.getElementById('itemForm');
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');

    // Função para mostrar o formulário de adicionar item
    addItemBtn.addEventListener('click', function() {
        formContainer.style.display = 'block';
        searchContainer.style.display = 'none';
        itemForm.style.display = 'block';
        itemForm.reset();
    });

    // Função para mostrar a barra de pesquisa e carregar itens para edição
    editItemBtn.addEventListener('click', function() {
        formContainer.style.display = 'none';
        searchContainer.style.display = 'block';
        itemForm.style.display = 'none';
        loadItems();
    });

    // Carregar os itens do JSON e exibir na pesquisa
    function loadItems() {
        fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json')
            .then(response => response.json())
            .then(items => {
                searchResults.innerHTML = ''; // Limpa resultados anteriores
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = `${item.id} - ${item.name}`;
                    li.addEventListener('click', () => loadItemForEdit(item));
                    searchResults.appendChild(li);
                });
            });
    }

    // Função para carregar o item no formulário de edição
    function loadItemForEdit(item) {
        formContainer.style.display = 'block';
        searchContainer.style.display = 'none';
        itemForm.style.display = 'block';
        document.getElementById('id').value = item.id;
        document.getElementById('name').value = item.name;
    }
});