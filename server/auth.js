const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const auth = {
  discordAuthUrl: () => {
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=identify`;
  },

  getToken: async (code) => {
    try {
      const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return response.data.access_token;
    } catch (error) {
      throw new Error('Falha ao obter token do Discord');
    }
  },

  // Função para validar o token consultando a API do Discord
  validateToken: async (req, res, next) => {
    const token = req.cookies.oauth_token;

    if (!token) {
      return res.redirect('/');  // Redireciona para a página inicial se o token não estiver presente
    }

    try {
      // Verifica a validade do token usando a API de informações do usuário
      const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Se o token for válido, a resposta trará as informações do usuário
      if (userResponse.status === 200) {
        return next();  // O token é válido, pode acessar a próxima middleware/rota
      }
    } catch (error) {
      // Se a API retornar erro, o token é inválido ou expirou
      console.error('Token inválido ou expirado:', error);
      res.clearCookie('oauth_token');  // Remove o cookie inválido
      return res.redirect('/');  // Redireciona para a página inicial
    }
  }
};

module.exports = auth;