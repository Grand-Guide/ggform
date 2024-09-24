const { XataClient } = require('@xata.io/client'); 
const xata = new XataClient();

exports.handler = async (event) => {
    try {
        const { token } = JSON.parse(event.body);
        
        console.log('Iniciando o processo de salvar o token no Xata...', token);

        const response = await xata.db.tokens.create({
            token: token, 
            createdAt: new Date().toISOString(),
        });

        console.log('Resposta do Xata:', response);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Token salvo com sucesso!' }),
        };
    } catch (error) {
        console.error('Erro ao salvar o token no Xata:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Falha ao salvar o token no banco de dados.' }),
        };
    }
};