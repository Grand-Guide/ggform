const { createClient } = supabase;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

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
                            access_token: data.access_token,
                            refresh_token: data.refresh_token
                        };

                        const { error } = await supabase
                            .from('users')
                            .insert({
                                discord_id: user.id,
                                username: user.username,
                                avatar_url: user.avatar,
                                access_token: user.access_token,
                                refresh_token: user.refresh_token,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString()
                            });

                        if (error) {
                            throw new Error('Erro ao adicionar usuário ao banco de dados: ' + error.message);
                        }

                        window.location.href = '/protected.html';
                    } else {
                        alert('Código inválido. Redirecionando...');
                        window.location.href = '/';
                    }
                } catch (error) {
                    alert('Erro na validação. Redirecionando...');
                    window.location.href = '/';
                }
            } else {
                window.location.href = '/';
            }
        };