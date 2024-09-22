const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

exports.handler = async function(event, context) {
    try {
        const userData = {
            username: 'Nome do Usuário',
            id: '123456789',
            avatar: 'avatar_id',
            avatar_extension: '.png',
            serverStatus: 'Membro',
            totalContributions: 10,
            acceptedContributions: 5,
            totalSubmitted: 8,
            totalAccepted: 4
        };

        const db = admin.firestore();
        await db.collection('profileAccess').add({
            userId: userData.id,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        };
    } catch (error) {
        console.error('Erro ao recuperar dados do perfil:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao recuperar dados do perfil' })
        };
    }
};