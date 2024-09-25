document.addEventListener("DOMContentLoaded", checkAuth);

async function checkAuth() {
    const user = supabase.auth.user();

    if (!user) {
        alert('Você precisa estar autenticado para acessar esta página.');
        window.location.href = '/';
    } else {
        await validateToken(user);
    }
}

async function validateToken(user) {
    try {
        const { error } = await supabase.auth.api.getUser(user.id);
        if (error) {
            throw new Error('Token inválido');
        }
    } catch (error) {
        alert('Sessão expirada. Redirecionando para login.');
        window.location.href = '/';
    }
}