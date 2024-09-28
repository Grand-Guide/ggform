document.addEventListener("DOMContentLoaded", async function() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!user) {
        window.location.href = '/';
    }
});