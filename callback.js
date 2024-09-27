// Inicializando o Supabase primeiro
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const response = await fetch(`/.netlify/functions/validate-oauth?code=${code}`);
            const data = await response.json();

            if (response.ok && data.access_token) {
                const user = {
                    id: data.user.id,
                    username: data.user.username,
                    avatar: data.user.avatar,
                    avatar_extension: data.user.avatar_extension || '.png',
                    serverStatus: data.user.serverStatus
                };

                await saveUserDataToSupabase(user, data.access_token);

                await verifyMembership(data.user.id, data.access_token);
            } else {
                alert('Código inválido. Redirecionando...');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Erro na solicitação:', error);
            alert('Erro na validação. Redirecionando...');
            window.location.href = '/';
        }
    } else {
        window.location.href = '/';
    }
};

async function saveUserDataToSupabase(user, accessToken) {
    try {
        const { data: existingUser, error } = await supabase
            .from('users')
            .select('*')
            .eq('discord_id', user.id);

        if (error) {
            console.error('Erro ao verificar usuário:', error);
            return;
        }

        if (existingUser.length === 0) {
            const { data, error: insertError } = await supabase
                .from('users')
                .insert([{
                    discord_id: user.id,
                    username: user.username,
                    avatar_url: `${user.avatar}${user.avatar_extension}`,
                    access_token: accessToken,
                }]);

            if (insertError) {
                console.error('Erro ao inserir usuário:', insertError);
            } else {
                console.log('Usuário inserido com sucesso:', data);
            }
        } else {
            console.log('Usuário já existe:', existingUser);
        }
    } catch (err) {
        console.error('Erro ao salvar dados do usuário:', err);
    }
}

async function verifyMembership(userId, accessToken) {
    try {
        const response = await fetch('/.netlify/functions/check-membership', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, access_token: accessToken }),
        });

        const data = await response.json();

        if (response.status === 200 && data.message.includes('está no servidor')) {
            window.location.href = '/protected.html';
        } else {
            alert('Você não está no servidor do Discord. Acesso negado.');
            window.location.href = '/error.html';
        }
    } catch (error) {
        console.error('Erro ao verificar associação ao servidor:', error);
        window.location.href = '/';
    }
}