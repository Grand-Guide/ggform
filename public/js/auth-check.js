document.addEventListener("DOMContentLoaded", checkAuth);

async function checkAuth() {
    const user = await getCurrentUser();

    if (!user) {
        alert('Você precisa estar autenticado para acessar esta página.');
        window.location.href = '/';
    } else {
        await validateToken(user);
    }
}

async function getCurrentUser() {
    const response = await fetch('/.netlify/functions/get-user');
    if (response.ok) {
        return await response.json();
    }
    return null;
}

async function validateToken(user) {
    try {
        const response = await fetch('/.netlify/functions/validate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.authToken })
        });

        if (!response.ok) {
            throw new Error('Token inválido');
        }
    } catch (error) {
        alert('Sessão expirada. Redirecionando para login.');
        window.location.href = '/';
    }
}