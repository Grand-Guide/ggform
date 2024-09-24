const { Client, GatewayIntentBits } = require('discord.js');
const { XataClient } = require('@xata.io/client');
require('dotenv').config();

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    databaseUrl: process.env.XATA_DATABASE_URL
});

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
        await xata.db.oauthAuthentications.create({
            userId: user.id,
            username: user.username,
            avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao adicionar usuário ao banco de dados:', error);
    }
}

client.login(process.env.BOT_TOKEN);

module.exports = { isUserInServer, addUserToDatabase };