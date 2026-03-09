const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const VAPT_CONFIG = {
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  storageBucket: "product-images",
};

function createSupabaseClient() {
  if (!window.supabase || !window.supabase.createClient) {
    console.warn("Supabase SDK nao carregado.");
    return null;
  }

  if (
    !VAPT_CONFIG.supabaseUrl ||
    VAPT_CONFIG.supabaseUrl.includes("YOUR_PROJECT") ||
    !VAPT_CONFIG.supabaseAnonKey ||
    VAPT_CONFIG.supabaseAnonKey.includes("YOUR_PUBLIC")
  ) {
    console.warn("Configure a URL e a ANON KEY do Supabase em assets/js/supabase.js.");
    return null;
  }

  return window.supabase.createClient(VAPT_CONFIG.supabaseUrl, VAPT_CONFIG.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

window.vaptSupabase = createSupabaseClient();
window.VAPT_CONFIG = VAPT_CONFIG;
