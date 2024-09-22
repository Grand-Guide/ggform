const axios = require('axios');

exports.handler = async (event) => {
  const { userId } = JSON.parse(event.body);
  const botToken = process.env.DISCORD_BOT_TOKEN;

  try {
  
    const response = await axios.get(`https://discord.com/api/v10/guilds/${process.env.GUILD_ID}/members`, {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    });      

    const isMember = response.data.some(member => member.user.id === userId);

    if (isMember) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User is a member' }),
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'User is not a member' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error validating user' }),
    };
  }
};