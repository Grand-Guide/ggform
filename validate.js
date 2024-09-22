import { db } from './firebase.js';
import { doc, setDoc } from "firebase/firestore";

function redirectToLogin() {
    window.location.href = 'index.html';
}

async function isValidCode(code) {
    try {
        const response = await fetch('/.netlify/functions/validate-code', {
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
        return result.valid;
    } catch (error) {
        console.error('Erro durante a validação:', error);
        return false;
    }
}

async function storeCodeInFirestore(code) {
    try {
        const userId = 'uniqueUserId';
        await setDoc(doc(db, "authTokens", userId), { token: code });
    } catch (error) {
        console.error('Erro ao armazenar no Firestore:', error);
    }
}

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    isValidCode(code).then(valid => {
        if (valid) {
            storeCodeInFirestore(code);

            document.querySelector('.container').style.display = 'block';
        } else {
            document.querySelector('.error-message').style.display = 'block';
            setTimeout(redirectToLogin, 3000);
        }
    });
} else {
    redirectToLogin();
}