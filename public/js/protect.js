document.addEventListener('DOMContentLoaded', function () {
    const addItemBtn = document.getElementById('addItemBtn');
    const editItemBtn = document.getElementById('editItemBtn');
    const backBtn = document.getElementById('backBtn');
    const formContainer = document.getElementById('formContainer');
    const searchContainer = document.getElementById('searchContainer');
    const itemForm = document.getElementById('itemForm');
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');

    // Função para alternar entre a tela inicial e o formulário/edição
    function showFormOrSearch(showForm) {
        addItemBtn.style.display = 'none';
        editItemBtn.style.display = 'none';
        backBtn.style.display = 'block';
        formContainer.style.display = showForm ? 'block' : 'none';
        searchContainer.style.display = showForm ? 'none' : 'block';
    }

    // Botão para adicionar novo item
    addItemBtn.addEventListener('click', function () {
        showFormOrSearch(true);
    });

    // Botão para editar item existente
    editItemBtn.addEventListener('click', function () {
        showFormOrSearch(false);
    });

    // Botão para voltar à tela inicial
    backBtn.addEventListener('click', function () {
        addItemBtn.style.display = 'block';
        editItemBtn.style.display = 'block';
        backBtn.style.display = 'none';
        formContainer.style.display = 'none';
        searchContainer.style.display = 'none';
    });

    // Limitar a exibição de itens da barra de pesquisa
    searchBar.addEventListener('input', async function () {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = ''; // Limpa os resultados anteriores

        if (query.length > 0) {
            const response = await fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json');
            const items = await response.json();

            const filteredItems = items.filter(item =>
                item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)
            ).slice(0, 8); // Limita a 8 resultados

            filteredItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.id} - ${item.name}`;
                li.addEventListener('click', function () {
                    document.getElementById('id').value = item.id;
                    document.getElementById('name').value = item.name;
                    showFormOrSearch(true); // Exibe o formulário para edição
                });
                searchResults.appendChild(li);
            });
        }
    });
});