const { Octokit } = require("@octokit/rest");

exports.handler = async function(event, context) {
  const { title, content, branchName, filePath } = JSON.parse(event.body);
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  const [owner, repo] = process.env.GITHUB_REPO.split("/");

  try {
    // Criar nova branch a partir da main
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: "heads/main"
    });

    const mainSha = refData.object.sha;

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: mainSha
    });

    // Criar ou atualizar o arquivo na nova branch
    const { data: fileData } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Update ${filePath} with new content`,
      content: Buffer.from(content).toString('base64'),
      branch: branchName
    });

    // Criar Pull Request
    const { data: prData } = await octokit.pulls.create({
      owner,
      repo,
      title,
      head: branchName,
      base: "main",
      body: "Proposta de atualização enviada através do formulário."
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: prData.html_url })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falha ao criar o Pull Request." })
    };
  }
};