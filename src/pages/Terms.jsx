import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Scale, Shield, Ban, Globe } from "lucide-react";
import SEO from "../components/SEO.jsx";
import { settingsAPI } from "../utils/supabase-api.js";

const Terms = () => {
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
        title="Kullanım Şartları"
        description="Gözcu Yazılım kullanım şartları. Web sitesi kullanımı, hizmet şartları ve kullanıcı hakları hakkında bilgi."
        keywords="kullanım şartları, hizmet şartları, kullanıcı sözleşmesi, Gözcu Yazılım"
        url="https://gozcu.tech/terms"
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
                Kullanım Şartları
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
                href="/privacy"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Gizlilik Politikası
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
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Kullanım Şartları
              </h1>
              <p className="text-xl text-slate-600">
                Web sitemizi kullanırken uymanız gereken kurallar ve şartlar
              </p>
              <p className="text-sm text-slate-500 mt-4">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  1. Genel Hükümler
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Bu kullanım şartları, Gözcu Yazılım Teknoloji AR-GE Ltd. Şti. ("Şirket") tarafından işletilen web sitesinin kullanımına ilişkin kuralları belirler. Web sitesini kullanarak, bu şartları kabul etmiş sayılırsınız.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Web sitesi, yazılım geliştirme, web tasarım ve bulut sunucu hizmetleri hakkında bilgi sağlamak amacıyla kullanılabilir.</li>
                    <li>Web sitesinin içeriği bilgilendirme amaçlıdır ve yasal tavsiye niteliği taşımaz.</li>
                    <li>Şirket, web sitesinin kesintisiz veya hatasız çalışmasını garanti etmez.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  2. Kullanıcı Yükümlülükleri
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Web sitesini kullanırken aşağıdaki kurallara uymanız gerekmektedir:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Web sitesini yasalara aykırı amaçlarla kullanmamak</li>
                    <li>Başkalarının haklarını ihlal edecek şekilde içerik paylaşmamak</li>
                    <li>Web sitesinin güvenliğini tehdit edecek eylemlerde bulunmamak</li>
                    <li>Virüs, malware veya zararlı kod yüklemeye çalışmamak</li>
                    <li>Web sitesinin altyapısına zarar verecek aktivitelerde bulunmamak</li>
                    <li>Başkalarının kişisel bilgilerini izinsiz paylaşmamak</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Ban className="w-6 h-6 text-blue-600" />
                  3. Yasaklanan Kullanımlar
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Aşağıdaki aktiviteler kesinlikle yasaktır:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Web sitesinin kaynak kodunu kopyalamak, çoğaltmak veya dağıtmak</li>
                    <li>Otomatik botlar veya scriptler kullanarak web sitesini taramak</li>
                    <li>Web sitesinin içeriğini izinsiz olarak başka platformlarda kullanmak</li>
                    <li>Spam, phishing veya dolandırıcılık amaçlı mesajlar göndermek</li>
                    <li>Web sitesinin performansını etkileyecek aşırı trafik oluşturmak</li>
                    <li>Telif hakkı ihlali yapacak içerik paylaşmak</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-blue-600" />
                  4. Fikri Mülkiyet Hakları
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Web sitesindeki tüm içerik, tasarım ve yazılım Şirket'e aittir ve telif hakkı koruması altındadır:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Web sitesindeki metinler, görseller, logolar ve tasarımlar Şirket'in mülkiyetindedir</li>
                    <li>İçerik, Şirket'in yazılı izni olmadan kopyalanamaz, dağıtılamaz veya kullanılamaz</li>
                    <li>Web sitesindeki yazılım kodları ve teknolojiler korumalıdır</li>
                    <li>Marka adları ve logolar ticari marka koruması altındadır</li>
                    <li>İzinsiz kullanım durumunda yasal işlem başlatılabilir</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                  5. Sorumluluk Reddi
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Şirket, web sitesinin kullanımından kaynaklanan aşağıdaki durumlardan sorumlu tutulamaz:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Web sitesinin geçici olarak erişilemez olması</li>
                    <li>Teknik hatalar veya sistem arızaları</li>
                    <li>Veri kaybı veya güvenlik ihlalleri</li>
                    <li>Üçüncü taraf web sitelerine bağlantılar</li>
                    <li>Kullanıcıların web sitesini yanlış kullanmasından kaynaklanan zararlar</li>
                    <li>Web sitesindeki bilgilerin güncel olmaması</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  6. Değişiklikler ve Güncellemeler
                </h2>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Şirket, bu kullanım şartlarını herhangi bir zamanda değiştirme hakkını saklı tutar:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Değişiklikler web sitesinde yayınlandığında yürürlüğe girer</li>
                    <li>Önemli değişiklikler için kullanıcılara bildirim yapılabilir</li>
                    <li>Değişikliklerden haberdar olmak için bu sayfayı düzenli olarak kontrol etmeniz önerilir</li>
                    <li>Web sitesini kullanmaya devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                  7. İletişim
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Kullanım şartları ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
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
              <a className="hover:text-slate-900 dark:hover:text-white" href="/privacy">
                Gizlilik Politikası
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

export default Terms;

