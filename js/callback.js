document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    const code = urlParams.get('code');
    const messageDiv = document.getElementById('message');

    let customMessage = '';

    if (error) {
        // Personalize a mensagem de erro com base no código de erro
        switch (error) {
            case 'access_denied':
                customMessage = 'Você recusou a autorização. Por favor, tente novamente.';
                break;
            case 'invalid_request':
                customMessage = 'A solicitação de autorização é inválida. Verifique suas configurações.';
                break;
            case 'unauthorized_client':
                customMessage = 'O cliente não está autorizado a fazer a solicitação.';
                break;
            case 'unsupported_response_type':
                customMessage = 'O tipo de resposta não é suportado.';
                break;
            default:
                customMessage = 'Ocorreu um erro ao tentar autenticar. Por favor, tente novamente mais tarde.';
                break;
        }

        messageDiv.innerHTML = `
            <p>Erro ao tentar autenticar: ${error}</p>
            <p>${customMessage}</p>
            <p>${errorDescription || ''}</p>
            <a href="/">Voltar para a página inicial</a>
        `;
    } else if (code) {
        // Se houver um código, isso indica sucesso na autorização
        messageDiv.innerHTML = `
            <p>Autenticação bem-sucedida!</p>
            <a href="https://example.com/area-restrita" class="button">Acessar Área Restrita</a>
        `;
    } else {
        // Se não houver parâmetros de erro ou código, exiba uma mensagem padrão
        messageDiv.innerHTML = `
            <p>Ocorreu um erro inesperado.</p>
            <a href="/">Voltar para a página inicial</a>
        `;
    }
});
