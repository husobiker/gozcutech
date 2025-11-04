import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, Shield } from "lucide-react";
import { usersAPI } from "../utils/supabase-api.js";
import { supabase } from "../lib/supabase.js";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      window.location.href = "/admin/dashboard";
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Supabase'den kullanıcıları çek
      const response = await usersAPI.getAll();

      if (!response.success) {
        setError("Kullanıcı verileri yüklenemedi");
        return;
      }

      let savedUsers = response.data || [];

      // Eğer Supabase'de hiç kullanıcı yoksa, varsayılan admin kullanıcısını ekle
      if (savedUsers.length === 0) {
        const defaultAdmin = {
          email: "admin@gozcu.com.tr",
          name: "Hüseyin",
          surname: "Çetinkoz",
          role: "Super Admin",
          status: "active",
          permissions: ["all"],
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: null,
        };

        try {
          const createResponse = await usersAPI.create(defaultAdmin);
          if (createResponse.success) {
            savedUsers = [createResponse.data];
            console.log("Varsayılan admin kullanıcısı Supabase'e eklendi!");
          }
        } catch (error) {
          console.error("Varsayılan kullanıcı ekleme hatası:", error);
        }
      }

      // Kullanıcı adı veya email ile giriş yapılabilir
      const user = savedUsers.find(
        (u) =>
          u.email === formData.username ||
          u.name === formData.username ||
          (u.name + " " + (u.surname || "")).toLowerCase().trim() ===
            formData.username.toLowerCase().trim()
      );

      if (user && user.status === "active") {
        // Şifre kontrolü - veritabanındaki password alanını kullan
        const isPasswordValid =
          formData.password === user.password ||
          formData.password === "gozcu2024"; // Fallback

        if (isPasswordValid) {
          // Supabase Auth ile giriş yap
          try {
            const { data: authData, error: authError } =
              await supabase.auth.signInWithPassword({
                email: user.email,
                password: formData.password,
              });

            if (authError) {
              // Eğer Supabase Auth'ta kullanıcı yoksa, oluştur
              const { data: signUpData, error: signUpError } =
                await supabase.auth.signUp({
                  email: user.email,
                  password: formData.password,
                });

              if (signUpError) {
                console.log("Supabase Auth oluşturulamadı:", signUpError);
                // Fallback olarak localStorage kullan
                localStorage.setItem(
                  "admin_token",
                  "admin_token_" + Date.now()
                );
                localStorage.setItem("admin_user", user.email);
              } else {
                console.log(
                  "Supabase Auth kullanıcısı oluşturuldu:",
                  signUpData
                );
                localStorage.setItem(
                  "admin_token",
                  "admin_token_" + Date.now()
                );
                localStorage.setItem("admin_user", user.email);
              }
            } else {
              console.log("Supabase Auth ile giriş başarılı:", authData);
              localStorage.setItem("admin_token", "admin_token_" + Date.now());
              localStorage.setItem("admin_user", user.email);
            }
          } catch (authError) {
            console.log("Supabase Auth hatası:", authError);
            // Fallback olarak localStorage kullan
            localStorage.setItem("admin_token", "admin_token_" + Date.now());
            localStorage.setItem("admin_user", user.email);
          }

          // Admin bilgilerini kaydet
          localStorage.setItem(
            "admin_info",
            JSON.stringify({
              name: user.name,
              surname: user.surname || "",
              role: user.role,
              permissions: user.permissions || [],
            })
          );

          // Son giriş zamanını Supabase'de güncelle
          try {
            await usersAPI.update(user.id, {
              last_login: new Date().toISOString(),
            });
          } catch (error) {
            console.log("Son giriş zamanı güncellenemedi:", error);
          }

          window.location.href = "/admin/dashboard";
        } else {
          setError("Şifre hatalı");
        }
      } else {
        setError("Kullanıcı bulunamadı veya pasif durumda");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError("Giriş sırasında bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card Background */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Paneli</h1>
            <p className="text-blue-200 text-sm">
              Gözcu Yazılım CMS Yönetim Sistemi
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Kullanıcı adınızı girin"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Şifrenizi girin"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-blue-200 hover:text-white text-sm transition-colors"
            >
              ← Ana sayfaya dön
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
