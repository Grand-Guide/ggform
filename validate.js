// validate.js

// Função que redireciona para a página inicial em caso de erro
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Função para verificar a validade do código no backend
async function isValidCode(code) {
    try {
        const response = await fetch('/.netlify/functions/validate-code', { // Chama a função serverless
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });

        if (!response.ok) {
            throw new Error('Resposta inválida do servidor');
        }

        const result = await response.json();
        return result.valid;  // Espera que o backend retorne { valid: true/false }
    } catch (error) {
        console.error('Erro durante a validação:', error);
        return false;
    }
}

// Obtém o código da URL
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

// Verifica se o código existe e é válido
if (code) {
    isValidCode(code).then(valid => {
        if (valid) {
            // Armazena o código temporariamente (localStorage ou sessionStorage)
            sessionStorage.setItem('authToken', code);

            // Exibe o conteúdo da página protegida
            document.querySelector('.container').style.display = 'block';
        } else {
            // Exibe mensagem de erro e redireciona
            document.querySelector('.error-message').style.display = 'block';
            setTimeout(redirectToLogin, 3000);
        }
    });
} else {
    // Redireciona para a página inicial se o código não estiver presente
    redirectToLogin();
}