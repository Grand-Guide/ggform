const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', () => {
    console.log('Gyu está online');
});

async function isUserInServer(userId, guildId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(userId);
        return member ? true : false;
    } catch (error) {
        return false;
    }
}

async function addUserToDatabase(user) {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({
                discord_id: user.id,
                username: user.username,
                avatar_url: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
                access_token: null,
                refresh_token: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (error) {
            throw new Error('Erro ao adicionar usuário ao banco de dados: ' + error.message);
        }

        console.log('Usuário adicionado com sucesso:', data);
    } catch (error) {
        console.error(error.message);
    }
}

client.login(process.env.BOT_TOKEN);

module.exports = { isUserInServer, addUserToDatabase };