document.getElementById("login-btn").addEventListener("click", function () {
    window.location.href = 'netlify/functions/redirect-to-discord.js';
});

document.getElementById("discord-btn").addEventListener("click", function () {
    const serverInviteUrl = 'https://discord.gg/GQx5MpX7cA';

    window.location.href = serverInviteUrl;
});