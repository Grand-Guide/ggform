// backend/server.js
const express = require('express');
const { Octokit } = require('@octokit/rest');
require('dotenv').config(); // Para carregar variáveis de ambiente do arquivo .env

const app = express();
app.use(express.json()); // Permite receber dados JSON no corpo da requisição

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

app.post('/api/submit-item', async (req, res) => {
    const { title, cover, description, price, category, quality, update, status, shop, hunting, recipe, videos } = req.body;

    try {
        // 1. Obter o conteúdo atual do arquivo items.json
        const { data: fileData } = await octokit.repos.getContent({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
        });

        // Decodificar o conteúdo do arquivo JSON
        const fileContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const items = JSON.parse(fileContent);

        // Adicionar o novo item à lista
        const newItem = {
            id: Date.now().toString(), // Use um identificador único
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

        // 2. Criar uma nova branch para a atualização
        const branchName = `update-items-${Date.now()}`;
        const baseBranch = 'main';
        await octokit.git.createRef({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            ref: `refs/heads/${branchName}`,
            sha: fileData.sha,
        });

        // 3. Atualizar o arquivo JSON com o novo item
        await octokit.repos.createOrUpdateFileContents({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            path: 'public/pages/items/items.json',
            message: 'Atualizar items.json com novo item',
            content: Buffer.from(JSON.stringify(items, null, 2)).toString('base64'),
            sha: fileData.sha,
            branch: branchName,
        });

        // 4. Criar um Pull Request
        await octokit.pulls.create({
            owner: 'Grand-Guide',
            repo: 'Grand-Guide.github.io',
            title: 'Adicionar novo item',
            head: branchName,
            base: baseBranch,
        });

        res.status(200).json({ message: 'Pull Request criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar Pull Request:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao processar sua solicitação.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor back-end rodando na porta 3000');
});
