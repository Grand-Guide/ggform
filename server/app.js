const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const auth = require('./auth');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rota para iniciar OAuth2
app.get('/auth/discord', (req, res) => {
  const discordAuthUrl = auth.discordAuthUrl();
  res.redirect(discordAuthUrl);
});

// Callback OAuth2, onde o token é obtido
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect('/');
  }

  try {
    const token = await auth.getToken(code);
    res.cookie('oauth_token', token, { httpOnly: true, secure: true });
    res.redirect('/form');
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    res.redirect('/');
  }
});

// Página protegida - Formulário (usa middleware de validação)
app.get('/form', auth.validateToken, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/form.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});