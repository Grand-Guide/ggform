const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async function(event) {
    const { code } = JSON.parse(event.body);

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ valid: false, message: 'Code is required' })
        };
    }

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token } = tokenResponse.data;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (userResponse.data) {
            const { error: insertError } = await supabase
                .from('codeValidations')
                .insert([
                    {
                        code: code,
                        user_id: userResponse.data.id,
                        timestamp: new Date().toISOString()
                    }
                ]);

            if (insertError) {
                throw new Error(insertError.message);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ valid: true })
            };
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ valid: false })
            };
        }

    } catch (error) {
        console.error('Erro durante a validação do código:', error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ valid: false })
        };
    }
};
