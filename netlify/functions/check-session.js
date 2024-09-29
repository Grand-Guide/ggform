async function verifyAdminAccess() {
        const response = await fetch('/.netlify/functions/check-admin', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!data || data.discord_id !== '854060317905911879') {
            alert('Acesso negado. Você não tem permissão para acessar esta página.');
            window.location.href = '/';
        }
    }

    async function fetchUsers() {
        const response = await fetch('/.netlify/functions/supabase-proxy');
        const users = await response.json();
        const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

        users.forEach(user => {
            const row = userTable.insertRow();
            row.innerHTML = `
                <td>${user.discord_id}</td>
                <td>${user.username}</td>
                <td>${user.is_banned ? 'Banido' : 'Ativo'}</td>
                <td>
                    <button onclick="updateUserStatus('${user.discord_id}', ${user.is_banned})">
                        ${user.is_banned ? 'Remover Ban' : 'Banir'}
                    </button>
                </td>
            `;
        });
    }

    async function updateUserStatus(discord_id, currentStatus) {
        const newStatus = !currentStatus;

        const response = await fetch('/.netlify/functions/supabase-proxy', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ discord_id, is_banned: newStatus }),
        });

        const result = await response.json();
        alert(result.message);
        location.reload();
    }

    window.onload = async function() {
        await verifyAdminAccess();
        fetchUsers();
    };