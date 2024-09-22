document.addEventListener("DOMContentLoaded", async function() {
    const searchBar = document.getElementById('searchBar');
    const searchResults = document.getElementById('searchResults');
    const formContainer = document.getElementById('formContainer');
    let items = [];

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
        searchResults.innerHTML = '';
        searchBar.value = '';
        document.getElementById('id').value = item.id;
        document.getElementById('name').value = item.name;
        document.getElementById('cover').value = item.cover || '';
        document.getElementById('description').value = item.description || '';
        document.getElementById('price').value = item.price || '';
        document.getElementById('update').value = item.update || '';
        document.getElementById('status').value = item.status || '';
        document.getElementById('quality').value = item.quality || '';
        document.getElementById('shop').value = item.shop || '';
        document.getElementById('hunting').value = item.hunting || '';
        document.getElementById('recipe').value = item.recipe || '';
        document.getElementById('videos').value = item.videos || '';
    }

    function sanitize(str) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = str;
        return tempDiv.innerHTML;
    }

    await loadItems();
});