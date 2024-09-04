document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const code = urlParams.get('code');
    const messageDiv = document.getElementById('message');
  
    if (error) {
      // Se houver um erro, exiba uma mensagem de erro
      messageDiv.innerHTML = `
        <p>Erro ao tentar autenticar: ${error}</p>
        <p>${errorDescription}</p>
        <a href="/">Voltar para a página inicial</a>
      `;
    } else if (code) {
      // Se houver um código, isso indica sucesso na autorização
      messageDiv.innerHTML = `
        <p>Autenticação bem-sucedida!</p>
        <a href="https://example.com/area-restrita" class="button">Acessar Área Restrita</a>
      `;
      // Opcionalmente, você pode enviar o código para o servidor para obter um token
    } else {
      // Se não houver parâmetros de erro ou código, exiba uma mensagem padrão
      messageDiv.innerHTML = `
        <p>Ocorreu um erro inesperado.</p>
        <a href="/">Voltar para a página inicial</a>
      `;
    }
  });
  