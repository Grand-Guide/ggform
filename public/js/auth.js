// auth.js
async function checkAuth() {
    const response = await fetch('/.netlify/functions/check-session', {
        credentials: 'include',
    });

    if (response.ok) {
        const data = await response.json();
        if (data.is_banned) {
            window.location.href = '/public/banned.html';
        }
    } else {
        window.location.href = '/';
    }
}

window.onload = checkAuth;