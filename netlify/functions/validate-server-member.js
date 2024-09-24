const axios = require('axios');
const { XataClient } = require('@xata.io/client');
require('dotenv').config();

const xata = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    databaseUrl: process.env.XATA_DATABASE_URL
});

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

        await xata.db.membershipChecks.create({
            userId: userId,
            isMember: isMember,
            timestamp: new Date().toISOString()
        });

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
        console.error('Error validating user:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error validating user' }),
        };
    }
};