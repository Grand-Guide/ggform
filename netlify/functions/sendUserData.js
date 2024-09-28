// netlify/functions/sendUserData.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    const userData = JSON.parse(event.body);

    const { data, error } = await supabase
        .from('users')
        .insert([userData]);

    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};