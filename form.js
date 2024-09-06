// Obtém o código da URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Verifica se o código existe e é válido (você precisará implementar essa lógica no seu backend)
if (code && isValidCode(code)) {
    // Armazena o código temporariamente (localStorage ou sessionStorage)
    sessionStorage.setItem('authToken', code);

    // Exibe o conteúdo da página protegida
    document.querySelector('.container').style.display = 'block';
} else {
    // Redireciona para a página de erro ou login, se o código for inválido
    window.location.href = 'error_page.html'; // Substitua pelo seu URL de erro
}

// Função para verificar a validade do código (implementação no backend)
function isValidCode(code) {
    // Lógica para verificar o código com a API do Discord ou seu sistema de autenticação
    // Retorna true se o código for válido, false caso contrário
}