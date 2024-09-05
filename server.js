const express = require('express');
const fetch = require('node-fetch');
const session = require('express-session');
const app = express();
require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

app.get('/auth/discord', (req, res) => {
    const redirectUri = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify guilds.join`;
    res.redirect(redirectUri);
});

app.get('/oauth2/callback', async (req, res) => {
    const code = req.query.code;
    const data = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        scope: 'identify guilds.join',
    };

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    });

    const tokenData = await response.json();
    req.session.token = tokenData.access_token;
    res.redirect('/form');
});

app.post('/submit', async (req, res) => {
    const itemData = req.body;

    // Envio do item como embed para o Discord via webhook
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            embeds: [
                {
                    title: itemData.name,
                    description: itemData.description,
                    fields: [
                        { name: "Preço", value: itemData.price, inline: true },
                        { name: "Imagem", value: itemData.cover, inline: true }
                    ],
                    image: { url: itemData.cover }
                }
            ]
        })
    });

    if (response.ok) {
        res.status(200).send({ message: "Item enviado com sucesso!" });
    } else {
        res.status(500).send({ message: "Erro ao enviar o item." });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000.'));