// auth-check.js
window.onload = async function() {
    try {
        const response = await fetch('/.netlify/functions/check-session', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 403) {
                alert('Você está banido. Redirecionando para a página inicial.');
            } else {
                alert('Você não está logado. Redirecionando para a página inicial.');
            }
            window.location.href = '/';
        }

        const user = await response.json();
        console.log('Usuário autenticado:', user);

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        window.location.href = '/';
    }
}