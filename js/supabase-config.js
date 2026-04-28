// Configuración de Supabase Oficial - Aula Plus
const SUPABASE_URL = "https://cvbmksiehknaigqamxty.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2Ym1rc2llaGtuYWlncWFteHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDgyMzksImV4cCI6MjA5MjY4NDIzOX0.y8icvtZn9x68PPdPDwNFnXg0Y7OgW_t2p-qB15WZ5TE";

// Inicialización del cliente
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Hacerlo disponible globalmente para todos los archivos (clases, exámenes, reportes)
window.supabase = supabaseClient;
