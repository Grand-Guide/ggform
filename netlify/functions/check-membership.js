const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async function(event) {
    const { user_id, access_token } = JSON.parse(event.body);
    const guildId = '819380036351688716';
    const discordApiUrl = `https://discord.com/api/v10/users/@me/guilds`;

    try {
        const response = await fetch(discordApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Erro ao obter guildas do usuário', error: errorText })
            };
        }

        const guilds = await response.json();
        const isMember = guilds.some(guild => guild.id === guildId);

        const { error: insertError } = await supabase
            .from('membershipChecks')
            .insert([
                {
                    user_id: user_id,
                    is_member: isMember,
                    timestamp: new Date().toISOString()
                }
            ]);

        if (insertError) {
            throw new Error(insertError.message);
        }

        return {
            statusCode: isMember ? 200 : 403,
            body: JSON.stringify({ message: isMember ? 'Usuário está no servidor' : 'Usuário não está no servidor' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao verificar o servidor', error: error.message })
        };
    }
};
