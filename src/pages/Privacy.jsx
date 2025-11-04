import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, Database, Users, Lock } from "lucide-react";
import SEO from "../components/SEO.jsx";
import { settingsAPI } from "../utils/supabase-api.js";

const Privacy = () => {
  const defaultSiteData = {
    email: "info@gozcu.tech",
    phone: "+90 555 111 22 33",
    address: "İstanbul, Türkiye",
    siteFooter: "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
  };

  const [siteData, setSiteData] = useState(defaultSiteData);

  useEffect(() => {
    loadSiteData();
  }, []);

  const loadSiteData = async () => {
    try {
      let currentData = { ...defaultSiteData };

      // Önce localStorage'dan yükle (hızlı başlangıç için)
      const savedSettings = localStorage.getItem("admin_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        currentData = {
          email: settings.email || defaultSiteData.email,
          phone: settings.phone || defaultSiteData.phone,
          address: settings.address || defaultSiteData.address,
          siteFooter: settings.siteFooter || defaultSiteData.siteFooter,
        };
        setSiteData(currentData);
      }

      // Backend'den site ayarlarını yükle (en güncel kaynak)
      try {
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
          const apiSettings = await settingsResponse.json();
          const mergedSettings = {
            email: apiSettings.contact?.email || currentData.email || defaultSiteData.email,
            phone: apiSettings.contact?.phone || currentData.phone || defaultSiteData.phone,
            address: apiSettings.contact?.address || currentData.address || defaultSiteData.address,
            siteFooter: apiSettings.general?.siteFooter || currentData.siteFooter || defaultSiteData.siteFooter,
          };

          currentData = mergedSettings;
          setSiteData(mergedSettings);
          localStorage.setItem(
            "admin_settings",
            JSON.stringify(mergedSettings)
          );
        }
      } catch (settingsError) {
        console.log("Backend ayarları yüklenemedi, localStorage kullanılıyor");
      }

      // Supabase'den ayarları yükle (sadece gerçek değerler varsa ve backend'den farklıysa güncelle)
      try {
        const settingsResult = await settingsAPI.get();
        if (settingsResult.success) {
          const settings = settingsResult.data;
          
          // Supabase'den değerleri al
          const supabaseEmail = 
            settings["contact.email"] || 
            settings["contact"]?.email ||
            null;
          const supabasePhone = 
            settings["contact.phone"] || 
            settings["contact"]?.phone ||
            null;
          const supabaseAddress = 
            settings["contact.address"] || 
            settings["contact"]?.address ||
            null;
          const supabaseFooter = 
            settings["general.siteFooter"] || 
            settings["general"]?.siteFooter ||
            null;

          // Sadece gerçek değerler varsa ve mevcut değerlerden farklıysa güncelle
          const hasValidEmail = supabaseEmail && supabaseEmail !== currentData.email;
          const hasValidPhone = supabasePhone && supabasePhone !== currentData.phone;
          const hasValidAddress = supabaseAddress && supabaseAddress !== currentData.address;
          const hasValidFooter = supabaseFooter && supabaseFooter !== currentData.siteFooter;

          if (hasValidEmail || hasValidPhone || hasValidAddress || hasValidFooter) {
            const updated = {
              email: hasValidEmail ? supabaseEmail : currentData.email,
              phone: hasValidPhone ? supabasePhone : currentData.phone,
              address: hasValidAddress ? supabaseAddress : currentData.address,
              siteFooter: hasValidFooter ? supabaseFooter : currentData.siteFooter,
            };
            
            setSiteData(updated);
            localStorage.setItem("admin_settings", JSON.stringify(updated));
          }
        }
      } catch (supabaseError) {
        console.log("Supabase ayarları yüklenemedi");
      }
    } catch (error) {
      console.error("Site verileri yüklenirken hata:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Gizlilik Politikası"
        description="Gözcu Yazılım gizlilik politikası. Kişisel verilerinizin korunması ve KVKK uyumlu veri işleme süreçleri hakkında bilgi."
        keywords="gizlilik politikası, KVKK, kişisel veri korunması, veri güvenliği, Gözcu Yazılım"
        url="https://gozcu.tech/privacy"
        type="website"
      />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-xl font-semibold text-slate-900">
                Gizlilik Politikası
              </h1>
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <a
                href="/"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Ana Sayfa
              </a>
              <a
                href="/terms"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Kullanım Koşulları
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Gizlilik Politikası
              </h1>
              <p className="text-xl text-slate-600">
                Kişisel verilerinizin korunması bizim için önemlidir
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Eye className="w-6 h-6 text-blue-600" />
                  1. Veri Toplama
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Gözcu Yazılım olarak, aşağıdaki kişisel verileri toplayabiliriz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>İletişim formu aracılığıyla: Ad, soyad, e-posta, telefon numarası</li>
                    <li>Newsletter aboneliği için: E-posta adresi</li>
                    <li>Web sitesi kullanımı için: IP adresi, tarayıcı bilgileri, çerezler</li>
                    <li>Analitik veriler: Sayfa görüntüleme, süre, kaynak</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  2. Veri Kullanımı
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Toplanan veriler aşağıdaki amaçlarla kullanılır:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Müşteri taleplerini yanıtlama ve iletişim kurma</li>
                    <li>Hizmet kalitesini artırma ve geliştirme</li>
                    <li>Yasal yükümlülükleri yerine getirme</li>
                    <li>Web sitesi performansını analiz etme</li>
                    <li>Newsletter gönderimi (izin verilmesi halinde)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  3. Veri Paylaşımı
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Yasal zorunluluklar</li>
                    <li>Mahkeme kararı</li>
                    <li>Hizmet sağlayıcıları (veri işleme amaçlı)</li>
                    <li>Açık rıza verilmesi halinde</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-600" />
                  4. Veri Güvenliği
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Verilerinizin güvenliği için aşağıdaki önlemleri alıyoruz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>SSL sertifikası ile şifreli veri iletimi</li>
                    <li>Güvenli sunucu altyapısı</li>
                    <li>Düzenli güvenlik güncellemeleri</li>
                    <li>Erişim kontrolü ve yetkilendirme</li>
                    <li>Veri yedekleme ve kurtarma planları</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  5. Çerezler (Cookies)
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Web sitemizde aşağıdaki çerez türlerini kullanıyoruz:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Zorunlu Çerezler
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Site işlevselliği için gerekli olan çerezler
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Analitik Çerezler
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Site kullanımını analiz etmek için kullanılan çerezler
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Pazarlama Çerezleri
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Kişiselleştirilmiş reklamlar için kullanılan çerezler
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        İşlevsel Çerezler
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Gelişmiş site özellikleri için kullanılan çerezler
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  6. Haklarınız
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    KVKK kapsamında aşağıdaki haklara sahipsiniz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                    <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                    <li>Kişisel verilerinizin işlenme amacını öğrenme</li>
                    <li>Yurt içi/yurt dışı aktarıldığı üçüncü tarafları bilme</li>
                    <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                    <li>Belirli şartlar altında silinmesini isteme</li>
                    <li>Düzeltme/silme işlemlerinin üçüncü taraflara bildirilmesini isteme</li>
                    <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme</li>
                    <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  7. İletişim
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Gizlilik politikası ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                  </p>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <p>
                      <strong>E-posta:</strong>{" "}
                      <a
                        href={`mailto:${siteData.email}`}
                        className="hover:underline text-blue-600 dark:text-blue-400"
                      >
                        {siteData.email}
                      </a>
                    </p>
                    <p>
                      <strong>Telefon:</strong>{" "}
                      <a
                        href={`tel:${siteData.phone}`}
                        className="hover:underline text-blue-600 dark:text-blue-400"
                      >
                        {siteData.phone}
                      </a>
                    </p>
                    <p>
                      <strong>Adres:</strong> {siteData.address}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-8 w-auto object-contain"
              />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Gözcu Yazılım
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  {siteData.siteFooter || `© ${new Date().getFullYear()} Tüm hakları saklıdır.`}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
              <a className="hover:text-slate-900 dark:hover:text-white" href="/">
                Ana Sayfa
              </a>
              <a className="hover:text-slate-900 dark:hover:text-white" href="/terms">
                Kullanım Koşulları
              </a>
              <a className="hover:text-slate-900 dark:hover:text-white" href="/#contact">
                İletişim
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
