document.getElementById("loginBtn").addEventListener("click", function () {
    const clientId = '1281408368078229616';
    const redirectUri = 'https://ggform.netlify.app/call-back';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

    window.location.href = discordAuthUrl;
});