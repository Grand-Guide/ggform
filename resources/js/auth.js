const { createClient } = supabase;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

document.getElementById('login-btn').onclick = async () => {
    const { user, session, error } = await supabase.auth.signIn({ provider: 'discord' });
    if (error) {
        alert('Erro ao autenticar com Discord: ' + error.message);
    } else {
        window.location.href = '/protected.html';
    }
};

document.getElementById('discord-btn').onclick = () => {
    window.open(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_AUTH_URL}&response_type=code&scope=identify`, '_self');
};
