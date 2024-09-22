document.addEventListener("DOMContentLoaded", async function() {
    const addItemBtn = document.getElementById('addItemBtn');
    const editItemBtn = document.getElementById('editItemBtn');
    const formContainer = document.getElementById('formContainer');
    const searchContainer = document.getElementById('searchContainer');
    const itemForm = document.getElementById('itemForm');
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');

    let items = [];

    addItemBtn.addEventListener('click', function() {
        formContainer.style.display = 'block';
        searchContainer.style.display = 'none';
        itemForm.style.display = 'block';
        itemForm.reset();
    });

    editItemBtn.addEventListener('click', function() {
        formContainer.style.display = 'none';
        searchContainer.style.display = 'block';
        itemForm.style.display = 'none';
        searchResults.innerHTML = '';
    });

    async function loadItems() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json');
            if (!response.ok) throw new Error('Erro ao carregar os itens');
            items = await response.json();
        } catch (err) {
            console.error("Erro ao carregar itens:", err);
            alert('Não foi possível carregar os itens. Tente novamente mais tarde.');
        }
    }

    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query) {
            const filteredItems = items.filter(item => 
                item.name.toLowerCase().includes(query) || item.id.toString().includes(query)
            );

            filteredItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = sanitize(`${item.id} - ${item.name}`);
                li.addEventListener('click', () => loadItemForEdit(item));
                searchResults.appendChild(li);
            });
        }
    });

    function loadItemForEdit(item) {
        formContainer.style.display = 'block';
        searchContainer.style.display = 'none';
        itemForm.style.display = 'block';
        document.getElementById('id').value = item.id;
        document.getElementById('name').value = item.name;
    }

    function sanitize(str) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = str;
        return tempDiv.innerHTML;
    }

    await loadItems();
});