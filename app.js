document.getElementById("login-btn").addEventListener("click", function () {
    const clientId = '1287177684006473818';
    const redirectUri = 'https://ggform.netlify.app/call-back';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20guilds`;

    window.location.href = discordAuthUrl;
});

document.getElementById("discord-btn").addEventListener("click", function () {
    const serverInviteUrl = 'https://discord.gg/GQx5MpX7cA';

    window.location.href = serverInviteUrl;
});