document.addEventListener("DOMContentLoaded", function() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function decryptData(data) {
        return JSON.parse(atob(data));
    }

    const encryptedUserData = getCookie('user_data');

    if (encryptedUserData) {
        const userData = decryptData(encryptedUserData);
        console.log('Usuário autenticado:', userData);
    } else {
        console.warn('Usuário não autenticado');
        window.location.href = '/';
    }
});