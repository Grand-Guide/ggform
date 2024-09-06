gsap.from('.container', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' }); 

// Código para construir a URL de autorização
const clientId = process.env.DISCORD_CLIENT_ID;
const redirectUri = process.env.REDIRECT_URI;

const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;

window.onload = function() {
    const discordButton = document.querySelector('.discord-button');
    if (discordButton) {
        discordButton.href = authUrl;
    }
};