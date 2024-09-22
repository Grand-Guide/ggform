document.addEventListener("DOMContentLoaded", checkAuth);

async function checkAuth() {
    const user = firebase.auth().currentUser;

    if (!user) {
        alert('Você precisa estar autenticado para acessar esta página.');
        window.location.href = '/';
    } else {
        await validateToken(user);
    }
}

async function validateToken(user) {
    try {
        const response = await fetch('/.netlify/functions/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await user.getIdToken()}`
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido');
        }
    } catch (error) {
        alert('Sessão expirada. Redirecionando para login.');
        window.location.href = '/';
    }
}