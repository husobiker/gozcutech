import { createClient } from "@supabase/supabase-js";

// Supabase konfigürasyonu - Environment variables'dan al
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://lvfvugeqesuaauxizsyz.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZnZ1Z2VxZXN1YWF1eGl6c3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MjE1MzIsImV4cCI6MjA3NTM5NzUzMn0.g2VjTaGUv1Hn8jyn_tCGHGHxrfnEHzUKpQUMzOqlFpQ";

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin işlemleri için service role key
const supabaseServiceKey =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZnZ1Z2VxZXN1YWF1eGl6c3l6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTgyMTUzMiwiZXhwIjoyMDc1Mzk3NTMyfQ.McsVcykgVEah-YSfRhzs9lXFLqZmaaJwmTGk4_D4H6M";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Debug için console'a yazdır
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing");
console.log(
  "Supabase Service Key:",
  supabaseServiceKey ? "✅ Set" : "❌ Missing"
);

// Veritabanı tabloları
export const TABLES = {
  BLOG_POSTS: "blog_posts",
  PROJECTS: "projects",
  SETTINGS: "settings",
  PLANS: "plans",
  CONTACTS: "contact_messages",
  USERS: "users",
};

// Yardımcı fonksiyonlar
export const supabaseHelpers = {
  // Hata yönetimi
  handleError: (error) => {
    console.error("Supabase Error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  },

  // Başarılı yanıt
  handleSuccess: (data) => {
    return {
      success: true,
      error: null,
      data: data,
    };
  },

  // Sayfalama
  paginate: (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { from, to };
  },
};
