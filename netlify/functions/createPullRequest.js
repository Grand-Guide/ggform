import { Octokit } from '@octokit/rest';
import { parse } from 'url';
import fetch from 'node-fetch';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Certifique-se de que a variável de ambiente está definida
});

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método não permitido' }),
        };
    }

    let requestBody;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Corpo da requisição inválido' }),
        };
    }

    const { title, cover, description, price, category, quality, update, status, shop, hunting, recipe, videos } = requestBody;

    try {
        // 1. Obter o conteúdo atual do arquivo items.json
        const { data: fileData } = await octokit.repos.getContent({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
        });

        const fileContent = Buffer.from(fileData.content, 'base64').toString('utf8');
        const items = JSON.parse(fileContent);

        // 2. Adicionar o novo item à lista
        const newItem = {
            id: `${Date.now()}`, // Gerar um ID único
            title,
            cover,
            description,
            price,
            category,
            quality,
            update,
            status,
            shop,
            hunting,
            recipe,
            videos,
        };

        items.push(newItem);

        // 3. Criar o novo conteúdo JSON
        const newContent = JSON.stringify(items, null, 2);

        // 4. Criar uma nova branch e enviar as alterações
        const branchName = `update-items-${Date.now()}`;
        const baseBranch = 'main'; // Alterar para o branch principal do seu repositório

        // Criar a branch
        await octokit.git.createRef({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            ref: `refs/heads/${branchName}`,
            sha: (await octokit.repos.getBranch({
                owner: 'Grand-Guide',
                repo: 'Grand-Guide.github.io',
                branch: baseBranch,
            })).data.commit.sha,
        });

        // Atualizar o arquivo na branch criada
        await octokit.repos.createOrUpdateFileContents({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
            message: 'Atualizar items.json com novo item',
            content: Buffer.from(newContent).toString('base64'),
            branch: branchName,
            sha: fileData.sha,
        });

        // Criar o Pull Request
        const { data: pullRequest } = await octokit.pulls.create({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            title: 'Adicionar novo item',
            head: branchName,
            base: baseBranch,
            body: 'Adicionando um novo item à lista.',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Pull Request criado com sucesso!', url: pullRequest.html_url }),
        };
    } catch (error) {
        console.error('Erro ao criar Pull Request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ocorreu um erro ao processar sua solicitação.' }),
        };
    }
}
