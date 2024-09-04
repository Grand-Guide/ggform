// netlify/functions/fetch-categories.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // URL bruta do GitHub para o arquivo items.json
    const response = await fetch('https://raw.githubusercontent.com/Grand-Guide/Grand-Guide.github.io/main/public/pages/items/items.json');

    const data = await response.json();

    if (response.ok) {
      // Extrair categorias dos itens
      const categories = data.map(item => item.name);

      return {
        statusCode: 200,
        body: JSON.stringify({ categories }),
      };
    } else {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Erro ao buscar categorias.' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno do servidor.' }),
    };
  }
};
