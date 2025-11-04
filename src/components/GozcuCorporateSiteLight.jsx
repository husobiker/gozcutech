import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Cpu,
  Shield,
  Server,
  Layers3,
  Sparkles,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Globe,
  Smartphone,
  Factory,
  Cloud,
  Sun,
  Moon,
  Tag,
  User,
  Calendar,
} from "lucide-react";
import {
  settingsAPI,
  blogAPI,
  projectsAPI,
  plansAPI,
  contactsAPI,
} from "../utils/supabase-api.js";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import ValidationUtils from "../utils/validation.js";
import CookieConsent from "./CookieConsent.jsx";
import SocialShare from "./SocialShare.jsx";
import PhoneInput from "./PhoneInput.jsx";
import AccessibilityUtils from "../utils/accessibility.js";
import { useToast } from "./Toast.jsx";
import SEO from "./SEO.jsx";

/**
 * GÖZCU YAZILIM TEKNOLOJİ AR-GE LTD. ŞTİ.
 * Kurumsal React Landing (LIGHT/DARK THEME) — Parallax + Scroll Animations
 *
 * Teknolojiler: TailwindCSS + Framer Motion + lucide-react
 * Kullanım: Bu dosyayı Next.js (app/page.tsx) ya da Vite/CRA (src/App.tsx) içine koy, Tailwind kurulu olmalı.
 */

// ---------- Dark Mode Context ----------
const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // İlk yüklemede localStorage'dan tema tercihini oku
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      // Sistem temasını kontrol et
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false; // Server-side rendering için varsayılan
  });

  useEffect(() => {
    // LocalStorage'a tema tercihini kaydet
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }

    // HTML elementine dark class'ını ekle/çıkar
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};

// ---------- yardımcı bileşenler ----------
const Section = ({ id, className = "", children }) => (
  <section
    id={id}
    className={`w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 ${className}`}
  >
    {children}
  </section>
);

const useParallax = (input = [0, 1], output = [0, 0]) => {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });
  const y = useTransform(spring, input, output);
  return { y };
};

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs tracking-wide text-slate-700 shadow-sm">
    {children}
  </span>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs">
    {children}
  </span>
);

const Card = ({ icon, title, desc, items, delay = 0 }) => (
  <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <motion.div
        className="rounded-xl p-2 bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-all"
        animate={{
          x: [0, 8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: delay,
          ease: "easeInOut",
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
        {title}
      </h3>
    </div>
    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 transition-colors duration-300">
      {desc}
    </p>
    {items && (
      <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            {it}
          </li>
        ))}
      </ul>
    )}
  </div>
);

// ---------- Typewriter Animation ----------
const TypewriterAnimation = () => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = ["360", "Cloud", "ERP", "Web", "Mobile", "AI", "DevOps", "API"];

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const current = texts[currentIndex];

        if (!isDeleting) {
          // Yazma efekti
          if (currentText.length < current.length) {
            setCurrentText(current.slice(0, currentText.length + 1));
          } else {
            // Yazma tamamlandı, silme başlasın
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          // Silme efekti
          if (currentText.length > 0) {
            setCurrentText(current.slice(0, currentText.length - 1));
          } else {
            // Silme tamamlandı, sonraki metne geç
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 60 : 120
    ); // Silme daha hızlı, yazma daha yavaş

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Main text */}
        <motion.span
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 min-w-[120px] inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: -4, x: -2 }}
          transition={{ duration: 0.3 }}
        >
          {currentText}

          {/* Animated cursor */}
          <motion.span
            className="ml-1 text-blue-500 dark:text-blue-300 font-mono"
            animate={{
              opacity: [1, 0, 1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            |
          </motion.span>
        </motion.span>

        {/* Code-like particles */}
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-1 h-1 bg-yellow-400 rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </motion.div>
    </div>
  );
};

// ---------- header ----------
const Header = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();

  useEffect(() => {
    const handler = () => {
      const el = document.querySelector("header");
      if (!el) return;
      if (window.scrollY > 10) {
        el.classList.add("shadow", "backdrop-blur-md");
        if (isDarkMode) {
          el.classList.add("bg-slate-900/80");
          el.classList.remove("bg-white/80");
        } else {
          el.classList.add("bg-white/80");
          el.classList.remove("bg-slate-900/80");
        }
      } else {
        el.classList.remove(
          "shadow",
          "bg-white/80",
          "bg-slate-900/80",
          "backdrop-blur-md"
        );
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [isDarkMode]);

  const nav = [
    { id: "home", label: t("header.nav.home") },
    { id: "about", label: t("header.nav.about") },
    { id: "solutions", label: t("header.nav.solutions") },
    { id: "plans", label: t("header.nav.plans") },
    { id: "references", label: t("header.nav.references") },
    { id: "blog", label: t("header.nav.blog"), href: "/blog" },
    { id: "contact", label: t("header.nav.contact") },
  ];

  const scrollTo = (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Blog için özel link
    if (id === "blog") {
      window.location.href = "/blog";
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 80; // Header yüksekliği
      const elementPosition = el.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1">
          <img
            src="/logo.png"
            alt="Gözcu Yazılım Logo"
            className="h-12 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300"
          />
          <div className="h-10 flex items-center ml-1">
            <TypewriterAnimation />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n, index) => (
            <motion.button
              key={n.id}
              onClick={(e) =>
                n.href ? (window.location.href = n.href) : scrollTo(n.id, e)
              }
              className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer pointer-events-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              {n.label}
            </motion.button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LanguageSwitcher />
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </motion.div>
          </motion.button>

          <motion.button
            onClick={(e) => scrollTo("contact", e)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-sm font-semibold hover:opacity-90 dark:hover:bg-slate-100 cursor-pointer pointer-events-auto transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            {t("header.cta")} <ArrowRight className="size-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

// ---------- simple clean stat item ----------
const SimpleStatItem = ({ number, suffix, label, icon, delay }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const increment = number / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          setCount(number);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, number]);

  return (
    <div ref={ref} className="text-center">
      {/* Simple Icon */}
      <div className="text-3xl mb-3">{icon}</div>

      {/* Simple Black Number */}
      <div className="text-4xl font-bold text-black dark:text-white mb-2 transition-colors duration-300">
        {count}
        {suffix}
      </div>

      {/* Simple Label */}
      <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
        {label}
      </div>
    </div>
  );
};

// ---------- hero (sade) ----------
const Hero = ({ siteData }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 1, 0.8, 0]
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 80; // Header yüksekliği
      const elementPosition = el.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500"
    >
      {/* Minimal Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Simple Background Shapes */}
      <motion.div
        style={{ y: yHeadline * 0.5 }}
        className="pointer-events-none absolute top-20 right-20 h-32 w-32 rounded-full bg-blue-200/30 blur-2xl"
      />
      <motion.div
        style={{ y: yHeadline * 0.3 }}
        className="pointer-events-none absolute bottom-20 left-20 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl"
      />

      <Section id="home" className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sol taraf - Metin içeriği */}
            <motion.div style={{ opacity: opacityHero }}>
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-6 py-3 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <Sparkles className="size-3" /> {t("hero.badge")}
              </motion.div>

              <motion.h1
                style={{ y: yHeadline }}
                className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300"
              >
                {t("hero.title")}{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>{" "}
                {t("hero.titleEnd")}
              </motion.h1>

              <motion.p
                style={{ y: yHeadline * 0.7 }}
                className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed transition-colors duration-300"
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                style={{ y: yHeadline * 0.5 }}
                className="mt-8 flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={() => scrollTo("contact")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("hero.primaryButton")} <ArrowRight className="size-4" />
                </motion.button>

                <motion.button
                  onClick={() => scrollTo("about")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t("hero.secondaryButton")}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Sağ taraf - Müşteri yorumları */}
            <motion.div
              style={{ y: yHeadline * 0.3 }}
              className="relative h-96"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Müşteri Yorumları Arka Plan */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Yorum 1 */}
                <motion.div
                  className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-700 max-w-48 transition-colors duration-300"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 0,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ahmet Y.
                    </span>
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    "Harika bir web sitesi yaptılar, çok memnunum!"
                  </p>
                </motion.div>

                {/* Yorum 2 */}
                <motion.div
                  className="absolute top-20 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 dark:border-slate-700 max-w-48 transition-colors duration-300"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Mehmet K.
                    </span>
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "ERP sistemimiz mükemmel çalışıyor!"
                  </p>
                </motion.div>

                {/* Yorum 3 */}
                <motion.div
                  className="absolute top-40 left-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 4,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      E
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Elif S.
                    </span>
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "Sunucu hizmetleri çok güvenilir!"
                  </p>
                </motion.div>

                {/* Yorum 4 */}
                <motion.div
                  className="absolute top-60 right-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 1,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      C
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Can Ö.
                    </span>
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "Özel yazılımımız tam istediğimiz gibi!"
                  </p>
                </motion.div>

                {/* Yorum 5 */}
                <motion.div
                  className="absolute top-80 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1, 0.8],
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: 3,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      D
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Deniz A.
                    </span>
                    <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "7/24 destek harika!"
                  </p>
                </motion.div>
              </div>

              {/* Yorum 6 */}
              <motion.div
                className="absolute top-12 right-16 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    K
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Kemal R.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Mobil uygulama mükemmel!"
                </p>
              </motion.div>

              {/* Yorum 7 */}
              <motion.div
                className="absolute top-32 left-12 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 1.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    B
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Burak L.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "E-ticaret sitesi süper!"
                </p>
              </motion.div>

              {/* Yorum 8 */}
              <motion.div
                className="absolute top-52 right-12 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 3.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    Z
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Zeynep K.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Kurumsal çözümler harika!"
                </p>
              </motion.div>

              {/* Yorum 9 */}
              <motion.div
                className="absolute top-72 left-16 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 2.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    O
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Oğuz M.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "API entegrasyonu mükemmel!"
                </p>
              </motion.div>

              {/* Yorum 10 */}
              <motion.div
                className="absolute top-88 right-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 4.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    F
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Fatma A.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Güvenlik çözümleri süper!"
                </p>
              </motion.div>

              {/* Yorum 11 */}
              <motion.div
                className="absolute top-6 left-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 5.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    T
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Tolga Y.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Veritabanı optimizasyonu harika!"
                </p>
              </motion.div>

              {/* Yorum 12 */}
              <motion.div
                className="absolute top-24 right-24 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 6,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    G
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Gizem H.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "UI/UX tasarımı mükemmel!"
                </p>
              </motion.div>

              {/* Yorum 13 */}
              <motion.div
                className="absolute top-44 left-20 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 6.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    H
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Hakan P.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Cloud migration süper!"
                </p>
              </motion.div>

              {/* Yorum 14 */}
              <motion.div
                className="absolute top-64 right-28 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 7,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    İ
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    İrem N.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "DevOps çözümleri harika!"
                </p>
              </motion.div>

              {/* Yorum 15 */}
              <motion.div
                className="absolute top-84 left-24 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 max-w-48"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1, 0.8],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: 7.5,
                  ease: "easeInOut",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    R
                  </div>
                  <span className="text-xs font-semibold text-slate-700">
                    Rıza K.
                  </span>
                  <div className="flex text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="text-xs text-slate-600">
                  "Machine Learning projesi süper!"
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Stylish Animated Stats */}
          <motion.div
            style={{ y: yHeadline * 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <SimpleStatItem
              number={50}
              suffix="+"
              label={t("stats.projects")}
              icon="🚀"
              delay={0.5}
            />
            <SimpleStatItem
              number={5}
              suffix="+"
              label={t("stats.experience")}
              icon="⭐"
              delay={0.6}
            />
            <SimpleStatItem
              number={24}
              suffix="/7"
              label={t("stats.support")}
              icon="🛡️"
              delay={0.7}
            />
            <SimpleStatItem
              number={100}
              suffix="%"
              label={t("stats.satisfaction")}
              icon="💎"
              delay={0.8}
            />
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

// ---------- about ----------
const About = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yAbout = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacityAbout = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  const scaleAbout = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <Section
      id="about"
      className="py-20 bg-white dark:bg-slate-900 transition-colors duration-500"
    >
      <div
        ref={ref}
        className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center"
      >
        <motion.div
          style={{ y: yAbout, opacity: opacityAbout, scale: scaleAbout }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            {t("about.title")}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7 transition-colors duration-300">
            {t("about.description")}
          </p>
          <motion.div
            style={{ y: yAbout * 0.5 }}
            className="mt-6 grid sm:grid-cols-2 gap-4"
          >
            <Card
              icon={<Globe className="size-5" />}
              title={t("about.web.title")}
              desc={t("about.web.desc")}
            />
            <Card
              icon={<Cloud className="size-5" />}
              title={t("about.cloud.title")}
              desc={t("about.cloud.desc")}
            />
            <Card
              icon={<Factory className="size-5" />}
              title={t("about.erp.title")}
              desc={t("about.erp.desc")}
            />
            <Card
              icon={<Code2 className="size-5" />}
              title={t("about.custom.title")}
              desc={t("about.custom.desc")}
            />
          </motion.div>
        </motion.div>
        <motion.div style={{ y: -yAbout * 0.3, opacity: opacityAbout }}>
          <div className="relative rounded-3xl border border-slate-200 bg-white p-1 shadow-md overflow-hidden">
            <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">
                {t("plans.cards.web.title")}{" "}
                <span className="block text-slate-500">
                  {t("plans.cards.web.subtitle")}
                </span>
              </div>
              <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">
                {t("plans.cards.cloud.title")}{" "}
                <span className="block text-slate-500">
                  {t("plans.cards.cloud.subtitle")}
                </span>
              </div>
              <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">
                {t("plans.cards.erp.title")}{" "}
                <span className="block text-slate-500">
                  {t("plans.cards.erp.subtitle")}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};

// ---------- solutions ----------
const Solutions = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yCards = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacityCards = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <Section
      id="solutions"
      className="py-20 bg-gradient-to-b from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500"
    >
      <div ref={ref} className="mx-auto max-w-7xl">
        <motion.div style={{ opacity: opacityCards }}>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            {t("solutions.title")}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl transition-colors duration-300">
            {t("solutions.description")}
          </p>
        </motion.div>
        <motion.div
          style={{ y: yCards }}
          className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card
            icon={<Globe className="size-5" />}
            title={t("solutions.web.title")}
            desc={t("solutions.web.description")}
            items={[
              t("solutions.web.items.responsive"),
              t("solutions.web.items.seo"),
              t("solutions.web.items.modern"),
            ]}
            delay={0}
          />
          <Card
            icon={<Cloud className="size-5" />}
            title={t("solutions.cloud.title")}
            desc={t("solutions.cloud.description")}
            items={[
              t("solutions.cloud.items.windows"),
              t("solutions.cloud.items.ubuntu"),
              t("solutions.cloud.items.support"),
            ]}
            delay={1}
          />
          <Card
            icon={<Factory className="size-5" />}
            title={t("solutions.erp.title")}
            desc={t("solutions.erp.description")}
            items={[
              t("solutions.erp.items.modules"),
              t("solutions.erp.items.reporting"),
              t("solutions.erp.items.integration"),
            ]}
            delay={2}
          />
          <Card
            icon={<Code2 className="size-5" />}
            title={t("solutions.custom.title")}
            desc={t("solutions.custom.description")}
            items={[
              t("solutions.custom.items.customer"),
              t("solutions.custom.items.scalable"),
              t("solutions.custom.items.secure"),
            ]}
            delay={3}
          />
        </motion.div>
      </div>
    </Section>
  );
};

// ---------- plans (pricing) ----------
const PlanCard = ({
  name,
  price,
  tagline,
  features,
  cta = "Teklif Al",
  serverType = null,
  planType = null,
}) => (
  <motion.div
    className={`rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full ${
      serverType === "windows"
        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white"
        : serverType === "linux"
        ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
        : planType === "web"
        ? "border-purple-200 bg-gradient-to-br from-purple-50 to-white"
        : "border-slate-200 bg-white"
    }`}
    whileHover={{
      y: -8,
      boxShadow:
        serverType === "windows"
          ? "0 20px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.1)"
          : serverType === "linux"
          ? "0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)"
          : planType === "web"
          ? "0 20px 25px -5px rgba(147, 51, 234, 0.15), 0 10px 10px -5px rgba(147, 51, 234, 0.1)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 },
    }}
  >
    {/* Matrix Code Background for Web Plans */}
    {planType === "web" && (
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 font-mono text-sm whitespace-nowrap"
              style={{
                left: `${(i % 4) * 25 + Math.random() * 10}%`,
                top: `${Math.random() * 20}%`,
              }}
              animate={{
                y: [0, 200],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5 + Math.random() * 2,
              }}
            >
              {(() => {
                const codes = [
                  "const React = require('react');",
                  "function Component() { return <div>Hello</div>; }",
                  "import { useState } from 'react';",
                  "export default function App() { return <h1>Web</h1>; }",
                  "const [state, setState] = useState(0);",
                  "useEffect(() => { console.log('mounted'); }, []);",
                  "const data = await fetch('/api/data');",
                  "return <div className='container'>Content</div>;",
                  "const router = useRouter();",
                  "const { data, loading } = useQuery(GET_DATA);",
                  "npm install react-router-dom",
                  "yarn add @types/react",
                ];
                return codes[Math.floor(Math.random() * codes.length)];
              })()}
            </motion.div>
          ))}
        </div>
      </div>
    )}
    <div className="flex items-baseline gap-2 relative z-10">
      <h3
        className={`text-xl font-semibold ${
          serverType === "windows"
            ? "text-blue-900"
            : serverType === "linux"
            ? "text-emerald-900"
            : planType === "web"
            ? "text-purple-900"
            : "text-slate-900"
        }`}
      >
        {name}
      </h3>
      <span
        className={`text-xs font-mono ${
          serverType === "windows"
            ? "text-blue-600"
            : serverType === "linux"
            ? "text-emerald-600"
            : planType === "web"
            ? "text-purple-600"
            : "text-slate-500"
        }`}
      >
        {tagline}
      </span>
    </div>
    <div
      className={`mt-2 text-3xl font-bold ${
        serverType === "windows"
          ? "text-blue-900"
          : serverType === "linux"
          ? "text-emerald-900"
          : planType === "web"
          ? "text-purple-900"
          : "text-slate-900"
      }`}
    >
      {price}
    </div>
    <ul className="mt-4 space-y-2 text-sm text-slate-700 relative z-10 flex-grow">
      {features.map((f, i) => (
        <motion.li
          key={i}
          className="flex items-start gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <CheckCircle2
            className={`size-4 mt-0.5 ${
              serverType === "windows"
                ? "text-blue-600"
                : serverType === "linux"
                ? "text-emerald-600"
                : planType === "web"
                ? "text-purple-600"
                : "text-emerald-600"
            }`}
          />
          {f}
        </motion.li>
      ))}
    </ul>
    <motion.a
      href="#contact"
      className={`mt-auto inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold hover:opacity-90 relative z-10 ${
        serverType === "windows"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : serverType === "linux"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : planType === "web"
          ? "bg-purple-600 text-white hover:bg-purple-700"
          : "bg-slate-900 text-white"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {cta} <ArrowRight className="size-4" />
    </motion.a>
  </motion.div>
);

const Plans = ({ plans = [] }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yPlans = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const opacityPlans = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  const [selectedPlan, setSelectedPlan] = useState("bulut");
  const [selectedServerType, setSelectedServerType] = useState("linux");

  const planTypes = {
    bulut: {
      title: "VIP Bulut Sunucu Planları",
      description:
        "Windows ve Ubuntu sunucu seçenekleriyle yüksek performans, güvenlik ve 7/24 teknik destek.",
      subCategories: {
        windows: {
          title: "Windows Sunucu Planları",
          description:
            "Windows Server ile yüksek performanslı bulut sunucular.",
          plans: [
            {
              name: "Windows Basic",
              price: "₺349/ay",
              tagline: "Giriş seviyesi Windows",
              features: [
                "2 vCPU / 4 GB RAM",
                "60 GB NVMe SSD",
                "Windows Server 2022",
                "Anlık snapshot",
              ],
            },
            {
              name: "Windows Pro",
              price: "₺699/ay",
              tagline: "Yoğun Windows iş yükü",
              features: [
                "4 vCPU / 8 GB RAM",
                "120 GB NVMe SSD",
                "Windows Server 2022",
                "Günlük yedekleme",
              ],
            },
            {
              name: "Windows Business",
              price: "₺1299/ay",
              tagline: "Kurumsal Windows çözümleri",
              features: [
                "8 vCPU / 16 GB RAM",
                "240 GB NVMe SSD",
                "Windows Server 2022",
                "Yüksek erişilebilirlik",
              ],
            },
            {
              name: "Windows Enterprise",
              price: "Teklif",
              tagline: "Özel Windows çözümleri",
              features: [
                "Özel donanım konfigürasyonu",
                "Gelişmiş güvenlik",
                "Yönetilen hizmetler",
                "7/24 özel destek",
              ],
              cta: "Teklif Al",
            },
          ],
        },
        linux: {
          title: "Linux Sunucu Planları",
          description: "Ubuntu ile yüksek performanslı bulut sunucular.",
          plans: [
            {
              name: "Linux Basic",
              price: "₺299/ay",
              tagline: "Giriş seviyesi Linux",
              features: [
                "2 vCPU / 4 GB RAM",
                "40 GB NVMe SSD",
                "Ubuntu 22.04",
                "Anlık snapshot",
              ],
            },
            {
              name: "Linux Pro",
              price: "₺599/ay",
              tagline: "Yoğun Linux iş yükü",
              features: [
                "4 vCPU / 8 GB RAM",
                "80 GB NVMe SSD",
                "Ubuntu 24.04",
                "Günlük yedekleme",
              ],
            },
            {
              name: "Linux Business",
              price: "₺999/ay",
              tagline: "Kurumsal Linux çözümleri",
              features: [
                "8 vCPU / 16 GB RAM",
                "160 GB NVMe SSD",
                "Ubuntu 24.04",
                "Yüksek erişilebilirlik",
              ],
            },
            {
              name: "Linux Enterprise",
              price: "Teklif",
              tagline: "Özel Linux çözümleri",
              features: [
                "Özel donanım konfigürasyonu",
                "Gelişmiş güvenlik",
                "Yönetilen hizmetler",
                "7/24 özel destek",
              ],
              cta: "Teklif Al",
            },
          ],
        },
      },
    },
    web: {
      title: "Web Tasarım & Programlama Planları",
      description:
        "Modern, responsive ve SEO uyumlu web siteleri ile dijital varlığınızı güçlendirin.",
      plans: [
        {
          name: "Kurumsal Web Sitesi",
          price: "₺2.500",
          tagline: "Profesyonel kurumsal kimlik",
          features: [
            "Responsive tasarım",
            "SEO optimizasyonu",
            "İçerik yönetim sistemi",
            "SSL sertifikası",
            "1 yıl hosting",
          ],
        },
        {
          name: "E-Ticaret Sitesi",
          price: "₺5.000",
          tagline: "Online satış platformu",
          features: [
            "Ürün kataloğu",
            "Sepet sistemi",
            "Ödeme entegrasyonu",
            "Stok yönetimi",
            "Sipariş takibi",
          ],
        },
        {
          name: "Özel Web Uygulaması",
          price: "Teklif",
          tagline: "İhtiyacınıza özel çözüm",
          features: [
            "Sıfırdan geliştirme",
            "Özel işlevsellik",
            "API entegrasyonu",
            "Veritabanı tasarımı",
            "Sürekli destek",
          ],
          cta: "Teklif Al",
        },
        {
          name: "Web Uygulaması Bakım",
          price: "₺500/ay",
          tagline: "Mevcut sitenizi güncel tutun",
          features: [
            "Güvenlik güncellemeleri",
            "İçerik güncellemeleri",
            "Performans optimizasyonu",
            "Yedekleme hizmeti",
            "Teknik destek",
          ],
        },
      ],
    },
    erp: {
      title: "ERP Yazılım Planları",
      description:
        "İşletmenize özel ERP sistemleri ile operasyonel verimliliği artırın.",
      plans: [
        {
          name: "Temel ERP",
          price: "Teklif Alınız",
          tagline: "Küçük işletmeler",
          features: [
            "Stok yönetimi",
            "Fatura sistemi",
            "Müşteri takibi",
            "Temel raporlar",
          ],
          cta: "Teklif Al",
        },
        {
          name: "Gelişmiş ERP",
          price: "Teklif Alınız",
          tagline: "Orta ölçekli",
          features: [
            "Üretim planlama",
            "İnsan kaynakları",
            "Muhasebe entegrasyonu",
            "Gelişmiş raporlar",
          ],
          cta: "Teklif Al",
        },
        {
          name: "Kurumsal ERP",
          price: "Teklif Alınız",
          tagline: "Büyük işletmeler",
          features: [
            "Çoklu şirket",
            "Workflow yönetimi",
            "API entegrasyonu",
            "Özel modüller",
          ],
          cta: "Teklif Al",
        },
        {
          name: "Özel ERP",
          price: "Teklif Alınız",
          tagline: "Tamamen özelleştirilebilir",
          features: [
            "Sıfırdan geliştirme",
            "Özel iş akışları",
            "Entegrasyonlar",
            "Özel raporlar",
          ],
          cta: "Teklif Al",
        },
      ],
    },
  };

  const getCurrentTitle = () => {
    if (selectedPlan === "bulut") {
      return planTypes[selectedPlan].subCategories[selectedServerType].title;
    }
    return planTypes[selectedPlan].title;
  };

  const getCurrentDescription = () => {
    if (selectedPlan === "bulut") {
      return planTypes[selectedPlan].subCategories[selectedServerType]
        .description;
    }
    return planTypes[selectedPlan].description;
  };

  const getCurrentPlans = () => {
    if (selectedPlan === "bulut") {
      return planTypes[selectedPlan].subCategories[selectedServerType].plans;
    }
    return planTypes[selectedPlan].plans;
  };

  return (
    <Section
      id="plans"
      className="py-20 bg-white dark:bg-slate-900 transition-colors duration-500"
    >
      <div ref={ref} className="mx-auto max-w-7xl">
        <motion.div style={{ opacity: opacityPlans }}>
          <h2
            className={`text-2xl md:text-3xl font-semibold tracking-tight transition-colors duration-300 ${
              selectedPlan === "bulut" && selectedServerType === "windows"
                ? "text-blue-900 dark:text-blue-300"
                : selectedPlan === "bulut" && selectedServerType === "linux"
                ? "text-emerald-900 dark:text-emerald-300"
                : selectedPlan === "web"
                ? "text-purple-900 dark:text-purple-300"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {getCurrentTitle()}
          </h2>
          <p
            className={`mt-3 max-w-2xl transition-colors duration-300 ${
              selectedPlan === "bulut" && selectedServerType === "windows"
                ? "text-blue-700 dark:text-blue-300"
                : selectedPlan === "bulut" && selectedServerType === "linux"
                ? "text-emerald-700 dark:text-emerald-300"
                : selectedPlan === "web"
                ? "text-purple-700 dark:text-purple-300"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {getCurrentDescription()}
          </p>

          {/* Plan Type Selector */}
          <motion.div
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              onClick={() => {
                setSelectedPlan("bulut");
                setSelectedServerType("linux");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedPlan === "bulut"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              VIP Bulut Sunucu
            </motion.button>
            <motion.button
              onClick={() => setSelectedPlan("web")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedPlan === "web"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Web Tasarım & Programlama
            </motion.button>
            <motion.button
              onClick={() => setSelectedPlan("erp")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedPlan === "erp"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              ERP Yazılımları
            </motion.button>
          </motion.div>

          {/* Server Type Selector - Only show when VIP Bulut is selected */}
          {selectedPlan === "bulut" && (
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setSelectedServerType("windows")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedServerType === "windows"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 12V6.75l6-1.32v6.48L3 12zm17-9v8.75l-10 .15V5.21L20 3zM3 13l6 .09v6.81l-6-1.15V13zm17 .25V22l-10-1.91V13.1l10 .15z" />
                </svg>
                Windows
              </motion.button>
              <motion.button
                onClick={() => setSelectedServerType("linux")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedServerType === "linux"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/src/images/linux.png"
                  alt="Linux"
                  className="w-4 h-4 object-contain"
                />
                Linux
              </motion.button>
            </motion.div>
          )}
        </motion.div>
        <motion.div
          style={{ y: yPlans }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {getCurrentPlans().map((plan, index) => (
            <motion.div
              key={`${selectedPlan}-${selectedServerType}-${index}`}
              className="flex flex-col h-full"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <PlanCard
                name={plan.name}
                price={plan.price}
                tagline={plan.tagline}
                features={plan.features}
                cta={plan.cta || "Teklif Al"}
                serverType={
                  selectedPlan === "bulut" ? selectedServerType : null
                }
                planType={selectedPlan}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
};

// ---------- references ----------
const References = ({ projects = [] }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRefs = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacityRefs = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const [selectedProject, setSelectedProject] = useState(null);

  // Projeler ana bileşenden geliyor
  const displayProjects = projects;

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <Section
        id="references"
        className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 transition-colors duration-500"
      >
        <div ref={ref} className="mx-auto max-w-7xl">
          <motion.div
            style={{ y: yRefs, opacity: opacityRefs }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 transition-colors duration-300">
              {t("references.title")}
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto transition-colors duration-300">
              {t("references.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProjectClick(project)}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {project.logo_data ? (
                        <img
                          src={project.logo_data}
                          alt={`${project.company_name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span
                        className="text-2xl"
                        style={{
                          display: project.logo_data ? "none" : "block",
                        }}
                      >
                        {project.logo || "🏢"}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-300">
                        {project.company_name || project.company}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 transition-colors duration-300">
                    {project.project_title || project.project_name}
                  </h4>

                  <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 transition-colors duration-300">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    <span>{project.year}</span>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs transition-colors duration-300">
                      {project.category}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      <span>Detayları gör</span>
                      <ArrowRight className="size-4 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {selectedProject.logo_data ? (
                      <img
                        src={selectedProject.logo_data}
                        alt={`${
                          selectedProject.company_name ||
                          selectedProject.company
                        } logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <span
                      className="text-3xl"
                      style={{
                        display: selectedProject.logo_data ? "none" : "block",
                      }}
                    >
                      {selectedProject.logo || "🏢"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {selectedProject.company_name || selectedProject.company}
                    </h2>
                    <p className="text-slate-500">
                      {selectedProject.project_title ||
                        selectedProject.project_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">
                    {selectedProject.project_title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {selectedProject.description}
                  </p>

                  {selectedProject.technologies && (
                    <>
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          Kullanılan Teknolojiler
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-slate-900">Süre</h5>
                          <p className="text-slate-600">
                            {selectedProject.duration}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-slate-900">Ekip</h5>
                          <p className="text-slate-600">
                            {selectedProject.team_size}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  {selectedProject.challenges && selectedProject.results && (
                    <>
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          Karşılaşılan Zorluklar
                        </h4>
                        <ul className="space-y-2">
                          {selectedProject.challenges.map(
                            (challenge, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-600">
                                  {challenge}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          Elde Edilen Sonuçlar
                        </h4>
                        <ul className="space-y-2">
                          {selectedProject.results.map((result, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-600">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-500">
                    Proje Yılı: {selectedProject.year}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Kapat
                    </button>
                    <motion.button
                      onClick={() => {
                        // Modal'ı kapat
                        closeModal();

                        // Aşağıya kaydır
                        setTimeout(() => {
                          const contactSection =
                            document.getElementById("contact");
                          if (contactSection) {
                            contactSection.scrollIntoView({
                              behavior: "smooth",
                            });
                          }
                        }, 100);
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        className="relative z-10"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                      >
                        Benzer Proje İstiyorum
                      </motion.span>

                      {/* Ripple Effect */}
                      <motion.div
                        className="absolute inset-0 bg-white opacity-20 rounded-lg"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{
                          scale: [0, 1.2, 0],
                          opacity: [0, 0.3, 0],
                          transition: { duration: 0.6 },
                        }}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

// ---------- contact ----------
const Contact = ({ siteData }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yContact = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacityContact = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    message: "",
    honeypot: "", // Spam koruması için gizli alan
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Rate limiting kontrolü
    const rateLimitCheck = ValidationUtils.checkRateLimit(
      "contact_form",
      3,
      60000
    );
    if (!rateLimitCheck.allowed) {
      error(
        `Çok fazla deneme yaptınız. ${rateLimitCheck.remainingTime} saniye sonra tekrar deneyin.`
      );
      return;
    }

    // Honeypot kontrolü
    const honeypotValidation = ValidationUtils.validateHoneypot(
      formData.honeypot
    );
    if (!honeypotValidation.isValid) {
      error("Bot tespit edildi!");
      return;
    }

    // Form validasyonu
    const validation = ValidationUtils.validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Spam kontrolü
    if (ValidationUtils.detectSpam(formData.message)) {
      error(
        "Mesajınız spam olarak algılandı. Lütfen daha açıklayıcı bir mesaj yazın."
      );
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Supabase'e iletişim formunu gönder
      console.log("Form verisi gönderiliyor:", {
        name: ValidationUtils.sanitizeInput(formData.name),
        email: ValidationUtils.sanitizeInput(formData.email),
        phone: formData.phone
          ? ValidationUtils.sanitizeInput(formData.phone)
          : "",
        project_type: formData.projectType,
        message: ValidationUtils.sanitizeInput(formData.message),
        status: "new",
        source: "website",
        ip_address: null, // IP adresi backend'de eklenebilir
        user_agent: navigator.userAgent,
      });

      const result = await contactsAPI.create({
        name: ValidationUtils.sanitizeInput(formData.name),
        email: ValidationUtils.sanitizeInput(formData.email),
        phone: formData.phone
          ? ValidationUtils.sanitizeInput(formData.phone)
          : "",
        project_type: formData.projectType,
        message: ValidationUtils.sanitizeInput(formData.message),
        status: "new",
        source: "website",
        ip_address: null, // IP adresi backend'de eklenebilir
        user_agent: navigator.userAgent,
      });

      if (result.success) {
        // Form'u temizle
        setFormData({
          name: "",
          email: "",
          phone: "",
          projectType: "",
          message: "",
          honeypot: "",
        });

        setSubmitSuccess(true);

        // Analytics event
        if (window.gtag) {
          window.gtag("event", "form_submit", {
            event_category: "Contact",
            event_label: "Contact Form Submitted",
          });
        }

        // 3 saniye sonra success mesajını gizle
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        console.error("Form gönderim hatası:", result.error);
        error("Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Form gönderim hatası:", error);
      error("Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Section
        id="contact"
        className="py-20 bg-gradient-to-t from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 transition-colors duration-500"
      >
        <div ref={ref} className="mx-auto max-w-5xl">
          {/* Success Message - Above the card */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl"
              >
                <p className="text-green-800 dark:text-green-200 text-sm font-medium text-center">
                  ✅ Mesajınız başarıyla gönderildi! En kısa sürede dönüş
                  yapacağız.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            style={{ y: yContact, opacity: opacityContact }}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm transition-colors duration-300"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                  {t("contact.title")}
                </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300 transition-colors duration-300">
                  {t("contact.description")}
                </p>
                <div className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
                    <a
                      className="hover:underline"
                      href="mailto:info@gozcu.com.tr"
                    >
                      {siteData?.email || "info@gozcu.tech"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
                    <a className="hover:underline" href="tel:+905551112233">
                      {siteData?.phone || "+90 555 111 22 33"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
                    {siteData?.address || "İstanbul, Türkiye"}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={siteData?.github || "https://github.com/gozcu"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-300"
                    >
                      <Github className="size-4" /> GitHub
                    </a>
                    <a
                      href={
                        siteData?.linkedin ||
                        "https://linkedin.com/company/gozcu"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-300"
                    >
                      <Linkedin className="size-4" /> LinkedIn
                    </a>
                    <a
                      href="/blog"
                      className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-300"
                    >
                      <Globe className="size-4" /> Blog
                    </a>
                  </div>
                </div>
              </div>
              {/* Success Message - Removed from here, will be shown above the card */}

              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-2 gap-4"
              >
                {/* Honeypot field (hidden) */}
                <input
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                  tabIndex="-1"
                  autoComplete="off"
                />

                {/* Name Field */}
                <div className="col-span-2 sm:col-span-1">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl bg-white dark:bg-slate-700 border px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 transition-colors duration-300 ${ValidationUtils.getFieldValidationClass(
                      "name",
                      formErrors
                    )}`}
                    placeholder={t("contact.form.name")}
                    style={{ colorScheme: "dark" }}
                    required
                    aria-describedby={
                      formErrors.name ? "name-error" : undefined
                    }
                  />
                  {formErrors.name && (
                    <p
                      id="name-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="col-span-2 sm:col-span-1">
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl bg-white dark:bg-slate-700 border px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 transition-colors duration-300 ${ValidationUtils.getFieldValidationClass(
                      "email",
                      formErrors
                    )}`}
                    placeholder={t("contact.form.email")}
                    type="email"
                    style={{ colorScheme: "dark" }}
                    required
                    aria-describedby={
                      formErrors.email ? "email-error" : undefined
                    }
                  />
                  {formErrors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="col-span-2 sm:col-span-1">
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) =>
                      handleInputChange({ target: { name: "phone", value } })
                    }
                    className={`w-full rounded-xl bg-white dark:bg-slate-700 border pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 transition-colors duration-300 ${ValidationUtils.getFieldValidationClass(
                      "phone",
                      formErrors
                    )}`}
                    placeholder="Telefon"
                    style={{ colorScheme: "dark" }}
                    aria-describedby={
                      formErrors.phone ? "phone-error" : undefined
                    }
                    required
                  />
                  {formErrors.phone && (
                    <p
                      id="phone-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                {/* Project Type Field */}
                <div className="col-span-2 sm:col-span-1">
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className={`w-full rounded-xl bg-white dark:bg-slate-700 border px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 transition-colors duration-300 ${ValidationUtils.getFieldValidationClass(
                      "projectType",
                      formErrors
                    )}`}
                    style={{ colorScheme: "dark" }}
                    required
                    aria-describedby={
                      formErrors.projectType ? "projectType-error" : undefined
                    }
                  >
                    <option value="">Proje Türü Seçin</option>
                    <option value="Web">Web Tasarım</option>
                    <option value="ERP">ERP Yazılımı</option>
                    <option value="Bulut">VIP Bulut Sunucu</option>
                    <option value="Özel">Özel Yazılım</option>
                  </select>
                  {formErrors.projectType && (
                    <p
                      id="projectType-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {formErrors.projectType}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="col-span-2">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full min-h-36 rounded-xl bg-white dark:bg-slate-700 border px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 transition-colors duration-300 ${ValidationUtils.getFieldValidationClass(
                      "message",
                      formErrors
                    )}`}
                    placeholder={t("contact.form.message")}
                    style={{ colorScheme: "dark" }}
                    required
                    aria-describedby={
                      formErrors.message ? "message-error" : undefined
                    }
                  />
                  {formErrors.message && (
                    <p
                      id="message-error"
                      className="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 text-sm font-semibold hover:opacity-90 dark:hover:bg-slate-100 relative overflow-hidden transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="relative z-10 flex items-center gap-2"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                  >
                    {t("contact.form.submit")}
                    <ArrowRight className="size-4" />
                  </motion.span>

                  {/* Ripple Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white opacity-20 rounded-xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{
                      scale: [0, 1.2, 0],
                      opacity: [0, 0.3, 0],
                      transition: { duration: 0.6 },
                    }}
                  />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
};

// ---------- footer ----------
const Footer = ({ siteData }) => {
  const { t } = useTranslation();

  const scrollTo = (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const el = document.getElementById(id);
    if (el) {
      const headerHeight = 80; // Header yüksekliği
      const elementPosition = el.offsetTop;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 border-t border-slate-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-12 w-auto object-contain dark:brightness-0 dark:invert transition-all duration-300"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Gözcu Yazılım
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Teknoloji AR-GE Ltd. Şti.
                </p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 max-w-md">
              {t("about.description")}
            </p>
            <div className="flex gap-4">
              <motion.a
                href={siteData?.github || "https://github.com/gozcu"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </motion.a>
              <motion.a
                href={siteData?.linkedin || "https://linkedin.com/company/gozcu"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
              <motion.a
                href="/blog"
                className="p-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Hızlı Linkler
            </h4>
            <ul className="space-y-3">
              {[
                { href: "#about", label: t("footer.nav.about") },
                { href: "#solutions", label: t("footer.nav.solutions") },
                { href: "#plans", label: t("footer.nav.plans") },
                { href: "/blog", label: t("footer.nav.blog") },
                { href: "#contact", label: t("footer.nav.contact") },
              ].map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors duration-300 flex items-center group"
                    onClick={(e) => scrollTo(link.href.replace("#", ""), e)}
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              İletişim
            </h4>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-blue-600 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <a
                    href={`mailto:${siteData?.email || "info@gozcu.tech"}`}
                    className="text-slate-600 dark:text-slate-300 text-sm hover:underline"
                  >
                    {siteData?.email || "info@gozcu.tech"}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-green-600 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <a
                    href={`tel:${siteData?.phone || "+90 555 111 22 33"}`}
                    className="text-slate-600 dark:text-slate-300 text-sm hover:underline"
                  >
                    {siteData?.phone || "+90 555 111 22 33"}
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-purple-600 rounded-lg">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {siteData?.address || "İstanbul, Türkiye"}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-slate-300 dark:border-slate-700 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 text-sm">
              <p>{siteData?.siteFooter || "© 2024 Gözcu Yazılım. Tüm hakları saklıdır."}</p>
            </div>

            <div className="flex items-center gap-6">
              <motion.a
                href="/privacy"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Gizlilik Politikası
              </motion.a>
              <motion.a
                href="/terms"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors duration-300 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Kullanım Şartları
              </motion.a>

              {/* Social Share */}
              <SocialShare
                url="https://gozcu.tech"
                title="Gözcu Yazılım - Teknoloji AR-GE Ltd. Şti."
                description="Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri."
                variant="minimal"
                showLabel={true}
              />

              <motion.div
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Çevrimiçi</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// ---------- blog section ----------
const BlogSection = ({
  blogPosts,
  adminInfo = { name: "Gözcu", surname: "Yazılım" },
}) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBlog = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacityBlog = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  return (
    <Section
      id="blog"
      className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500"
    >
      <div ref={ref} className="mx-auto max-w-7xl">
        <motion.div
          style={{ y: yBlog, opacity: opacityBlog }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 transition-colors duration-300">
            {t("blog.title")}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto transition-colors duration-300">
            {t("blog.description")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {post.featured_image ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center transition-colors duration-300"
                    style={{ display: "none" }}
                  >
                    <div className="text-slate-400 dark:text-slate-300 text-sm transition-colors duration-300">
                      Blog Görseli
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center transition-colors duration-300">
                  <div className="text-slate-400 dark:text-slate-300 text-sm transition-colors duration-300">
                    Blog Görseli
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="size-4 text-slate-500 dark:text-slate-400 transition-colors duration-300" />
                  <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 transition-colors duration-300">
                  {post.excerpt ||
                    post.content?.substring(0, 150) + "..." ||
                    "Blog içeriği"}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4 transition-colors duration-300">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      {post.author ||
                        `${adminInfo?.name || "Gözcu"} ${
                          adminInfo?.surname || "Yazılım"
                        }`}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="size-4" />
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString(
                            "tr-TR",
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "Yeni"}
                    </div>
                  </div>
                  <span>{post.read_time || "5"} dk</span>
                </div>

                <motion.a
                  href={`/blog/${post.id}`}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 rounded-xl font-medium hover:opacity-90 dark:hover:bg-slate-100 transition-colors duration-300 block text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Devamını Oku
                </motion.a>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 text-lg shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Tüm Blog Yazıları
            <ArrowRight className="size-5" />
          </motion.a>
        </motion.div>
      </div>
    </Section>
  );
};

// ---------- ana bileşen ----------
export default function GozcuCorporateSiteLight() {
  // Toast hook
  const { success, error, ToastContainer } = useToast();

  // State for dynamic data
  const [siteData, setSiteData] = useState({
    siteName: "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
    siteFooter: "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
    siteDescription:
      "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri.",
    email: "info@gozcu.tech",
    phone: "+90 555 111 22 33",
    address: "İstanbul, Türkiye",
    github: "https://github.com/gozcu",
    linkedin: "https://linkedin.com/company/gozcu",
    totalProjects: 50,
    totalBlogs: 8,
    totalVisitors: 1247,
    totalRevenue: 45600,
  });

  const [blogPosts, setBlogPosts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [plans, setPlans] = useState([]);
  const [adminInfo, setAdminInfo] = useState({ name: "", surname: "" });
  const [loading, setLoading] = useState(true);

  // Load dynamic data
  useEffect(() => {
    loadSiteData();
  }, []);

  const loadSiteData = async () => {
    try {
      setLoading(true);

      // Admin bilgilerini yükle
      const savedAdminInfo = localStorage.getItem("admin_info");
      if (savedAdminInfo) {
        const admin = JSON.parse(savedAdminInfo);
        setAdminInfo({
          name: admin.name || "",
          surname: admin.surname || "",
        });
      }

      // Önce localStorage'dan yükle (hızlı başlangıç için)
      const savedSettings = localStorage.getItem("admin_settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setSiteData({
          siteName: settings.siteName || siteData.siteName,
          siteFooter: settings.siteFooter || siteData.siteFooter || "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
          siteDescription: settings.siteDescription || siteData.siteDescription,
          email: settings.email || siteData.email,
          phone: settings.phone || siteData.phone,
          address: settings.address || siteData.address,
          github: settings.github || siteData.github,
          linkedin: settings.linkedin || siteData.linkedin,
          totalProjects: settings.totalProjects || siteData.totalProjects,
          totalBlogs: settings.totalBlogs || siteData.totalBlogs,
          totalVisitors: settings.totalVisitors || siteData.totalVisitors,
          totalRevenue: settings.totalRevenue || siteData.totalRevenue,
        });
      }

      // Backend'den site ayarlarını yükle
      try {
        const settingsResponse = await fetch("/api/settings");
        if (settingsResponse.ok) {
          const apiSettings = await settingsResponse.json();
          const mergedSettings = {
            siteName: apiSettings.general?.siteName || siteData.siteName,
            siteFooter: apiSettings.general?.siteFooter || siteData.siteFooter || "© 2024 Gözcu Yazılım. Tüm hakları saklıdır.",
            siteDescription:
              apiSettings.general?.siteDescription || siteData.siteDescription,
            email: apiSettings.contact?.email || siteData.email,
            phone: apiSettings.contact?.phone || siteData.phone,
            address: apiSettings.contact?.address || siteData.address,
            github: apiSettings.social?.github || siteData.github,
            linkedin: apiSettings.social?.linkedin || siteData.linkedin,
            instagram: apiSettings.social?.instagram || siteData.instagram,
          };

          setSiteData(mergedSettings);
          localStorage.setItem(
            "admin_settings",
            JSON.stringify(mergedSettings)
          );
        }
      } catch (settingsError) {
        console.log("Backend ayarları yüklenemedi, localStorage kullanılıyor");
      }

      const savedBlogs = localStorage.getItem("admin_blogs");
      if (savedBlogs) {
        const blogs = JSON.parse(savedBlogs);
        setBlogPosts(blogs.slice(0, 3)); // İlk 3 blog yazısını göster
      }

      const savedProjects = localStorage.getItem("admin_projects");
      if (savedProjects) {
        const projectsToShow = JSON.parse(savedProjects).map((project) => ({
          ...project,
          company_name: project.company_name || project.company,
          project_title: project.project_title || project.project_name,
        }));
        setProjects(projectsToShow);
      }

      // Supabase'den blog yazılarını yükle (arka planda)
      try {
        const blogResult = await blogAPI.getAll({
          status: "published",
          limit: 3,
          featured: true,
        });

        if (blogResult.success) {
          setBlogPosts(blogResult.data);
          localStorage.setItem("admin_blogs", JSON.stringify(blogResult.data));
        }
      } catch (blogError) {
        console.log(
          "Blog yazıları Supabase'den yüklenemedi, localStorage kullanılıyor"
        );
      }

      // Supabase'den projeleri yükle (arka planda)
      try {
        const projectsResult = await projectsAPI.getAll({
          featured: true,
          limit: 6,
          status: "active",
        });

        if (projectsResult.success) {
          const formattedProjects = projectsResult.data.map((project) => ({
            ...project,
            company_name: project.company_name || project.company,
            project_title: project.project_title || project.project_name,
          }));
          setProjects(formattedProjects);
          localStorage.setItem(
            "admin_projects",
            JSON.stringify(formattedProjects)
          );
        }
      } catch (projectsError) {
        console.log(
          "Projeler Supabase'den yüklenemedi, localStorage kullanılıyor"
        );
      }

      // Backend'den planları yükle
      try {
        const plansResponse = await fetch("/api/plans");
        if (plansResponse.ok) {
          const apiPlans = await plansResponse.json();
          const plansToShow = apiPlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            tagline: plan.description,
            features: plan.features || [],
            cta: plan.button_text || "Teklif Al",
            plan_type: plan.plan_type || "web",
            server_type: plan.server_type || "linux",
            featured: plan.popular || false,
          }));
          setPlans(plansToShow);
          localStorage.setItem("admin_plans", JSON.stringify(plansToShow));
        }
      } catch (plansError) {
        console.log("Backend planları yüklenemedi, localStorage kullanılıyor");
        const savedPlans = localStorage.getItem("admin_plans");
        if (savedPlans) {
          const plansToShow = JSON.parse(savedPlans).map((plan) => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            tagline: plan.tagline,
            features: plan.features || [],
            cta: plan.cta_text || "Teklif Al",
            plan_type: plan.plan_type || "web",
            server_type: plan.server_type || "linux",
            featured: plan.featured || false,
          }));
          setPlans(plansToShow);
        }
      }
    } catch (error) {
      console.error("Site verileri yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Site yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <DarkModeProvider>
      <SEO
        title={siteData?.siteName ? `${siteData.siteName} | gozcu.tech` : "Gözcü Yazılım Teknoloji | gozcu.tech"}
        description={siteData?.siteDescription ? `Gözcü Yazılım Teknoloji - ${siteData.siteDescription} gozcu.tech` : "Gözcü Yazılım Teknoloji - Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri. gozcu.tech"}
        keywords="Gözcü Yazılım Teknoloji, gözcü yazılım teknoloji, gozcu.tech, web tasarım, web programlama, ERP yazılımı, bulut sunucu, VIP sunucu, özel yazılım, teknoloji AR-GE, İstanbul"
        url="https://gozcu.tech"
        type="website"
        siteData={siteData}
      />
      <main className="min-h-screen scroll-smooth bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-500">
        <AccessibilityUtils.SkipLink href="#hero">
          Ana içeriğe geç
        </AccessibilityUtils.SkipLink>

        <Header siteData={siteData} />
        <Hero siteData={siteData} />
        <About siteData={siteData} />
        <Solutions />
        <Plans plans={plans} />
        <References projects={projects} />
        <BlogSection blogPosts={blogPosts} adminInfo={adminInfo} />
        <Contact siteData={siteData} />
        <Footer siteData={siteData} />
        <CookieConsent />
        <ToastContainer />
      </main>
    </DarkModeProvider>
  );
}
