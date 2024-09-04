exports.handler = async function(event, context) {
    if (!Octokit) {
        // Certifique-se de que o Octokit está carregado
        const octokitModule = await import('@octokit/rest');
        Octokit = octokitModule.Octokit;
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    const { title, content, branchName, filePath } = JSON.parse(event.body);

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

        // 8. Criar o pull request
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
        console.error('Erro ao criar Pull Request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
