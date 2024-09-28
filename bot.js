const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

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

client.login(process.env.BOT_TOKEN);

module.exports = { isUserInServer };