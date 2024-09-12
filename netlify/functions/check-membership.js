async function verifyMembership() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authToken = sessionStorage.getItem('authToken');

    if (!user || !authToken) {
        // Se o usuário não está logado, redireciona para a página inicial
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/check-membership', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                access_token: authToken
            }),
        });

        const data = await response.json();

        if (response.ok && data.message === 'Usuário está no servidor') {
            console.log('Usuário confirmado no servidor:', data.message);
            // Usuário está no servidor, pode acessar a página
        } else {
            console.log('Acesso negado:', data.message);
            window.location.href = '/error.html';  // Redireciona para a página de erro
        }
    } catch (error) {
        console.error('Erro ao verificar associação ao servidor:', error);
        window.location.href = '/error.html';  // Redireciona em caso de erro
    }
}

// Executa a verificação de associação ao carregar a página
window.onload = verifyMembership;