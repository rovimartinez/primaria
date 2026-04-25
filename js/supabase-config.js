// Configuración de Supabase
const SUPABASE_URL = "https://cvbmksiehknaigqamxty.supabase.co";
const SUPABASE_KEY = "TU_ANON_KEY_AQUI"; // Debes pegar aquí tu 'anon public key'

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Exportar para uso en otros archivos
window.supabase = supabase;
