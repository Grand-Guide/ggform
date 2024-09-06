// netlify/functions/auth.js
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8888/.netlify/functions/auth-callback'
  : process.env.REDIRECT_URI;

exports.handler = async function (event, context) {
  const authorizationUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authorizationUrl,
    },
  };
};