exports.handler = async function(event, context) {
    const { Octokit } = await import('@octokit/rest');
    
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    try {
        const branchName = `add-item-${Date.now()}`;
        const filePath = 'public/pages/items/items.json';  // Substitua pelo caminho correto

        // Obtenha o conteúdo atual do arquivo JSON no GitHub
        const { data: fileData } = await octokit.repos.getContent({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: filePath,
        });

        const content = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

        // Adicione o novo item ao conteúdo
        const newItem = JSON.parse(event.body); // Supondo que o corpo da requisição contenha o novo item em JSON
        content.push(newItem);

        // Converta o conteúdo atualizado para base64
        const updatedContent = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');

        // Crie um novo branch
        const { data: mainBranch } = await octokit.git.getRef({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            ref: 'heads/main'
        });

        await octokit.git.createRef({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            ref: `refs/heads/${branchName}`,
            sha: mainBranch.object.sha
        });

        // Atualize o arquivo JSON no novo branch
        await octokit.repos.createOrUpdateFileContents({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: filePath,
            message: `Add new item: ${newItem.title}`,
            content: updatedContent,
            branch: branchName,
            sha: fileData.sha
        });

        // Crie o pull request
        const pullRequest = await octokit.pulls.create({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            title: `Add new item: ${newItem.title}`,
            head: branchName,
            base: 'main',
            body: `This pull request adds a new item: ${newItem.title}`
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Pull request criado com sucesso!', pullRequest }),
        };
    } catch (error) {
        console.error('Erro ao criar pull request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Erro ao criar pull request' }),
        };
    }
};