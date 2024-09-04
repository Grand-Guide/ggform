const { Octokit } = require('@octokit/rest');
const { Buffer } = require('buffer');

exports.handler = async function(event) {
    // Certifique-se de que o conteúdo da função é JSON
    if (event.headers['Content-Type'] !== 'application/json') {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid request format. Content-Type must be application/json.' }),
        };
    }

    // Parseia o corpo da requisição
    const { title, content, branchName, filePath } = JSON.parse(event.body);

    // Instancie o Octokit com o token de autenticação
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    try {
        // 1. Obter o conteúdo atual do arquivo items.json
        const { data: fileData } = await octokit.repos.getContent({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
        });

        // 2. Decodificar o conteúdo do arquivo de base64 para string
        const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');

        // 3. Parsear o conteúdo do arquivo para um array JSON
        const items = JSON.parse(fileContent);

        // 4. Adicionar o novo item ao final da lista
        const newItem = JSON.parse(content);
        items.push(newItem);

        // 5. Converter o array atualizado de volta para string e codificar em base64
        const updatedContent = Buffer.from(JSON.stringify(items, null, 2)).toString('base64');

        // 6. Criar uma nova branch
        await octokit.git.createRef({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            ref: `refs/heads/${branchName}`,
            sha: fileData.sha,
        });

        // 7. Atualizar o arquivo com o novo conteúdo
        await octokit.repos.createOrUpdateFileContents({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
            message: `Adiciona novo item: ${title}`,
            content: updatedContent,
            branch: branchName,
            sha: fileData.sha,
        });

        // 8. Criar o Pull Request
        const { data: pullRequest } = await octokit.pulls.create({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            title: `Adiciona novo item: ${title}`,
            head: branchName,
            base: 'main',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: pullRequest.html_url }),
        };

    } catch (error) {
        console.error('Erro ao criar Pull Request:', error); // Imprime o objeto de erro completo

        let errorMessage = 'Ocorreu um erro interno ao processar sua solicitação.'; 

        if (error.status) {
            switch (error.status) {
                case 401:
                    errorMessage = 'Erro de autenticação. Verifique seu token GitHub.';
                    break;
                case 404:
                    errorMessage = 'Arquivo ou repositório não encontrado. Verifique o caminho e as configurações.';
                    break;
                case 422:
                    errorMessage = 'Erro de validação. Verifique se os dados enviados estão corretos.';
                    break;
                // Adicione mais casos conforme necessário
            }
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage }),
        };
    }
};