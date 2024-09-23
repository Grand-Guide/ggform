const axios = require('axios');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

exports.handler = async function(event, context) {
    const code = event.queryStringParameters.code;

    if (!code) {
        console.error('Código não fornecido');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Code is required' })
        };
    }

    try {
        console.log('Iniciando validação com o código:', code);
        
        const response = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: 'https://ggform.netlify.app/call-back'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const tokenData = response.data;
        console.log('Token de acesso recebido:', tokenData);

        const userInfoResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`
            }
        });

        const userInfo = userInfoResponse.data;
        console.log('Informações do usuário:', userInfo);

        const embed = {
            embeds: [{
                title: "Novo Usuário Autorizado",
                color: 0x00FF00,
                fields: [
                    { name: "ID do Usuário", value: userInfo.id, inline: true },
                    { name: "Nome de Usuário", value: userInfo.username, inline: true },
                    { name: "Avatar", value: `[Link do Avatar](https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png)`, inline: false }
                ],
                thumbnail: { url: `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` },
                timestamp: new Date().toISOString()
            }]
        };

        await axios.post(process.env.DISCORD_AUTH_URL, embed, {
            headers: { 'Content-Type': 'application/json' }
        });

        const db = admin.firestore();
        await db.collection('oauthAuthentications').add({
            userId: userInfo.id,
            username: userInfo.username,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                access_token: tokenData.access_token,
                user: {
                    id: userInfo.id,
                    username: userInfo.username,
                    avatar: userInfo.avatar ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png` : null
                }
            })
        };

    } catch (error) {
        console.error('Erro na validação do código:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to validate code',
                details: error.response ? error.response.data : error.message
            })
        };
    }
};