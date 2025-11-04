import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Settings,
  Image,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { settingsAPI } from "../utils/api.js";

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    // Site Bilgileri
    siteName: "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
    siteFooter: "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
    siteDescription:
      "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri.",
    siteKeywords:
      "web tasarım, web programlama, ERP yazılımı, bulut sunucu, VIP sunucu, özel yazılım, teknoloji AR-GE, İstanbul",

    // İletişim Bilgileri
    email: "info@gozcu.tech",
    phone: "+90 555 111 22 33",
    address: "İstanbul, Türkiye",

    // Sosyal Medya
    github: "https://github.com/gozcu",
    linkedin: "https://linkedin.com/company/gozcu",
    instagram: "https://instagram.com/gozcu_yazilim",

    // Analytics
    googleAnalyticsId: "GA_MEASUREMENT_ID",

    // SEO
    metaTitle:
      "Gözcu Yazılım - Teknoloji AR-GE Ltd. Şti. | Web Tasarım, ERP, Bulut Sunucu",
    metaDescription:
      "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri. 7/24 teknik destek.",

    // İstatistikler
    totalProjects: 50,
    totalBlogs: 8,
    totalVisitors: 1247,
    totalRevenue: 45600,
  });

  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Load settings from API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Önce localStorage'dan yükle
      const savedSettings = localStorage.getItem("admin_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSettings(settings);
      }

      // Backend'den ayarları yükle (arka planda)
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const apiSettings = await response.json();
          const newSettings = {
            // General
            siteName: apiSettings.general?.siteName || settings.siteName,
            siteFooter: apiSettings.general?.siteFooter || settings.siteFooter || "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
            siteDescription:
              apiSettings.general?.siteDescription || settings.siteDescription,
            siteKeywords:
              apiSettings.general?.siteKeywords || settings.siteKeywords,
            // Contact
            email: apiSettings.contact?.email || settings.email,
            phone: apiSettings.contact?.phone || settings.phone,
            address: apiSettings.contact?.address || settings.address,
            // Social
            github: apiSettings.social?.github || settings.github,
            linkedin: apiSettings.social?.linkedin || settings.linkedin,
            instagram: apiSettings.social?.instagram || settings.instagram,
            // Analytics
            googleAnalyticsId:
              apiSettings.analytics?.googleAnalyticsId ||
              settings.googleAnalyticsId,
            // SEO
            metaTitle: apiSettings.seo?.metaTitle || settings.metaTitle,
            metaDescription:
              apiSettings.seo?.metaDescription || settings.metaDescription,
          };
          setSettings(newSettings);
          localStorage.setItem("admin_settings", JSON.stringify(newSettings));
        }
      } catch (backendError) {
        console.log("Backend bağlantısı yok, localStorage kullanılıyor");
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Önce localStorage'a kaydet
      localStorage.setItem("admin_settings", JSON.stringify(settings));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);

      // Backend'e kaydet (arka planda)
      try {
        const settingsData = {
          general: {
            siteName: settings.siteName,
            siteFooter: settings.siteFooter,
            siteDescription: settings.siteDescription,
            siteKeywords: settings.siteKeywords,
          },
          contact: {
            email: settings.email,
            phone: settings.phone,
            address: settings.address,
          },
          social: {
            github: settings.github,
            linkedin: settings.linkedin,
            instagram: settings.instagram,
          },
          analytics: {
            googleAnalyticsId: settings.googleAnalyticsId,
          },
          seo: {
            metaTitle: settings.metaTitle,
            metaDescription: settings.metaDescription,
          },
        };

        const response = await fetch("/api/settings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify(settingsData),
        });

        if (!response.ok) {
          throw new Error("Backend kayıt hatası");
        }
      } catch (backendError) {
        console.log("Backend bağlantısı yok, sadece localStorage güncellendi");
      }
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: "general", label: "Genel Ayarlar", icon: Settings },
    { id: "contact", label: "İletişim Bilgileri", icon: Mail },
    { id: "social", label: "Sosyal Medya", icon: Globe },
    { id: "seo", label: "SEO Ayarları", icon: RefreshCw },
    { id: "analytics", label: "Analytics", icon: Eye },
  ];

  const Sidebar = () => (
    <div className="w-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-fit">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Ayarlar</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );

  const GeneralSettings = () => {
    const siteNameRef = React.useRef(null);
    const siteFooterRef = React.useRef(null);
    const siteDescriptionRef = React.useRef(null);
    const siteKeywordsRef = React.useRef(null);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Site Bilgileri
          </h3>
          <div className="space-y-4">
            <div onClick={() => siteNameRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Site Adı
              </label>
              <input
                ref={siteNameRef}
                type="text"
                value={settings.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div onClick={() => siteFooterRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Site Footer
              </label>
              <input
                ref={siteFooterRef}
                type="text"
                value={settings.siteFooter || "© 2024 Gözcu Yazılım. Tüm hakları saklıdır."}
                onChange={(e) => handleInputChange("siteFooter", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="© 2024 Gözcu Yazılım. Tüm hakları saklıdır."
              />
            </div>
            <div onClick={() => siteDescriptionRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Site Açıklaması
              </label>
              <textarea
                ref={siteDescriptionRef}
                value={settings.siteDescription}
                onChange={(e) =>
                  handleInputChange("siteDescription", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
            <div onClick={() => siteKeywordsRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Anahtar Kelimeler
              </label>
              <input
                ref={siteKeywordsRef}
                type="text"
                value={settings.siteKeywords}
                onChange={(e) =>
                  handleInputChange("siteKeywords", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="virgülle ayırın"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ContactSettings = () => {
    const emailInputRef = React.useRef(null);
    const phoneInputRef = React.useRef(null);
    const addressInputRef = React.useRef(null);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            İletişim Bilgileri
          </h3>
          <div className="space-y-4">
            <div onClick={() => emailInputRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={emailInputRef}
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div onClick={() => phoneInputRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div onClick={() => addressInputRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Adres
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={addressInputRef}
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SocialSettings = () => {
    const githubRef = React.useRef(null);
    const linkedinRef = React.useRef(null);
    const instagramRef = React.useRef(null);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Sosyal Medya
          </h3>
          <div className="space-y-4">
            <div onClick={() => githubRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                GitHub
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={githubRef}
                  type="url"
                  value={settings.github}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
            <div onClick={() => linkedinRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                LinkedIn
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={linkedinRef}
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) =>
                    handleInputChange("linkedin", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/company"
                />
              </div>
            </div>
            <div onClick={() => instagramRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Instagram
              </label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={instagramRef}
                  type="url"
                  value={settings.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SEOSettings = () => {
    const metaTitleRef = React.useRef(null);
    const metaDescriptionRef = React.useRef(null);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            SEO Ayarları
          </h3>
          <div className="space-y-4">
            <div onClick={() => metaTitleRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Meta Başlık
              </label>
              <input
                ref={metaTitleRef}
                type="text"
                value={settings.metaTitle}
                onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength="60"
              />
              <p className="text-xs text-slate-500 mt-1">
                {settings.metaTitle.length}/60 karakter
              </p>
            </div>
            <div onClick={() => metaDescriptionRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Meta Açıklama
              </label>
              <textarea
                ref={metaDescriptionRef}
                value={settings.metaDescription}
                onChange={(e) =>
                  handleInputChange("metaDescription", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                maxLength="160"
              />
              <p className="text-xs text-slate-500 mt-1">
                {settings.metaDescription.length}/160 karakter
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsSettings = () => {
    const analyticsIdRef = React.useRef(null);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Analytics Ayarları
          </h3>
          <div className="space-y-4">
            <div onClick={() => analyticsIdRef.current?.focus()}>
              <label className="block text-sm font-medium text-slate-700 mb-2 cursor-text">
                Google Analytics ID
              </label>
              <div className="relative">
                <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={analyticsIdRef}
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) =>
                    handleInputChange("googleAnalyticsId", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GA_MEASUREMENT_ID"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Google Analytics 4 Measurement ID'nizi girin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSettings />;
      case "contact":
        return <ContactSettings />;
      case "social":
        return <SocialSettings />;
      case "seo":
        return <SEOSettings />;
      case "analytics":
        return <AnalyticsSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Site Ayarları
          </h2>
          <p className="text-slate-600 mt-1">
            Site genel ayarlarını yönetin ve düzenleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <motion.div
              className="flex items-center gap-2 text-green-600 text-sm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Check className="w-4 h-4" />
              Kaydedildi!
            </motion.div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-600/50 transition-colors"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <Sidebar />
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
