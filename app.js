document.getElementById("loginBtn").addEventListener("click", function () {
    const clientId = '1281408368078229616'; // Substitua pelo seu Client ID
    const redirectUri = 'https://ggform.netlify.app/call-back'; // Substitua pela URL pública do seu protected.html
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email`;

    window.location.href = discordAuthUrl;
});