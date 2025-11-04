import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2, Code2, Cpu, Shield, Server, Layers3, Sparkles, Mail, MapPin, Phone, Github, Linkedin, Globe, Smartphone, Factory, Cloud } from "lucide-react";

/**
 * GÖZCU YAZILIM TEKNOLOJİ AR-GE LTD. ŞTİ.
 * Kurumsal React Landing (LIGHT THEME) — Parallax + Scroll Animations
 *
 * Teknolojiler: TailwindCSS + Framer Motion + lucide-react
 * Kullanım: Bu dosyayı Next.js (app/page.tsx) ya da Vite/CRA (src/App.tsx) içine koy, Tailwind kurulu olmalı.
 */

// ---------- yardımcı bileşenler ----------
const Section: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({ id, className = "", children }) => (
  <section id={id} className={`w-full px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 ${className}`}>{children}</section>
);

const useParallax = (input: number[] = [0, 1], output: number[] = [0, 0]) => {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });
  const y = useTransform(spring, input, output);
  return { y };
};

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs tracking-wide text-slate-700 shadow-sm">{children}</span>
);

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs">{children}</span>
);

const Card: React.FC<{ icon: React.ReactNode; title: string; desc: string; items?: string[] }> = ({ icon, title, desc, items }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-3">
      <div className="rounded-xl p-2 bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition-all">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
    </div>
    <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
    {items && (
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />{it}</li>
        ))}
      </ul>
    )}
  </div>
);

// ---------- header ----------
const Header: React.FC = () => {
  useEffect(() => {
    const handler = () => {
      const el = document.querySelector("header");
      if (!el) return;
      if (window.scrollY > 10) el.classList.add("shadow", "bg-white/80", "backdrop-blur-md");
      else el.classList.remove("shadow", "bg-white/80", "backdrop-blur-md");
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const nav = [
    { id: "home", label: "Ana Sayfa" },
    { id: "about", label: "Hakkımızda" },
    { id: "solutions", label: "Çözümler" },
    { id: "plans", label: "Planlar" },
    { id: "contact", label: "İletişim" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 grid place-items-center font-bold text-white">G</div>
          <div className="text-sm leading-tight">
            <div className="font-semibold tracking-tight text-slate-900">Gözcu Yazılım</div>
            <div className="text-xs text-slate-600">Teknoloji AR-GE Ltd. Şti.</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className="text-slate-700 hover:text-slate-900 transition-colors">
              {n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => scrollTo("contact")} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90">
          Teklif Al <ArrowRight className="size-4" />
        </button>
      </div>
    </header>
  );
};

// ---------- hero (parallax) ----------
const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <div ref={ref} className="relative min-h-[90vh] overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      {/* arka plan şekilleri */}
      <motion.div style={{ y: yBack }} className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-300/40 blur-3xl" />
      <motion.div style={{ y: yBack }} className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-indigo-300/40 blur-3xl" />

      <Section id="home" className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge><Sparkles className="size-3" /> Web · Mobil · ERP · VIP Cloud</Badge>
            <motion.h1 style={{ y: yHeadline }} className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Modern, güvenilir ve ölçeklenebilir yazılım çözümleri.
            </motion.h1>
            <motion.p style={{ y: yMid }} className="mt-4 text-base md:text-lg text-slate-600 max-w-2xl">
              Kurumsal web ve mobil uygulamalardan, fabrikalara yönelik ERP modüllerine ve VIP bulut sunuculara kadar uçtan uca hizmet veriyoruz.
            </motion.p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href="#solutions" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50 transition-colors">Çözümleri Gör</a>
              <a href="#plans" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Planlar <ArrowRight className="size-4"/></a>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              <Pill>React / Next.js</Pill>
              <Pill>React Native (iOS / Android)</Pill>
              <Pill>Postgres / Supabase</Pill>
              <Pill>Ubuntu 22.04 / 24.04</Pill>
            </div>
          </div>
          <div className="relative">
            <motion.div style={{ y: yMid }} className="rounded-3xl border border-slate-200 bg-white shadow-md p-1">
              <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
};

// ---------- about ----------
const About: React.FC = () => (
  <Section id="about" className="py-20 bg-white">
    <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Biz Kimiz?</h2>
        <p className="mt-4 text-slate-600 leading-7">
          Gözcu Yazılım; güvenlik & tesis yönetimi, üretim ve hizmet sektörlerinde ölçeklenebilir yazılımlar üretir. AR-GE odağımız; gerçek zamanlı
          operasyon yönetimi, IoT & video akışları, ERP entegrasyonları ve yüksek erişilebilir mimarilerdir.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <Card icon={<Shield className="size-5" />} title="Güvenlik" desc="RLS, şifreleme, denetim günlükleri, RBAC ve mevzuata uyum." />
          <Card icon={<Server className="size-5" />} title="Bulut" desc="CI/CD, gözlemlenebilirlik, otomatik ölçekleme ve yedekleme." />
          <Card icon={<Code2 className="size-5" />} title="Modern Stack" desc="React/Next.js, React Native, Postgres, Supabase, Edge Functions." />
          <Card icon={<Cpu className="size-5" />} title="AR-GE" desc="RFID/QR, RTSP/WebRTC, iki yönlü ses, cihaz yönetimi ve test." />
        </div>
      </div>
      <div>
        <div className="relative rounded-3xl border border-slate-200 bg-white p-1 shadow-md overflow-hidden">
          <div className="aspect-[4/3] w-full rounded-2xl bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">Gözcü360 <span className="block text-slate-500">Güvenlik & Vardiya SaaS</span></div>
            <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">Boşta Mısın? <span className="block text-slate-500">Gig Marketplace</span></div>
            <div className="rounded-xl bg-white/90 border border-slate-200 p-3 text-xs text-slate-800">Direksiyon Hocası <span className="block text-slate-500">Eşleştirme</span></div>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

// ---------- solutions ----------
const Solutions: React.FC = () => (
  <Section id="solutions" className="py-20 bg-gradient-to-b from-white to-sky-50">
    <div className="mx-auto max-w-7xl">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Çözümler</h2>
      <p className="mt-3 text-slate-600 max-w-3xl">Web, mobil ve ERP projelerinden, VIP bulut sunuculara kadar uçtan uca kurumsal çözümler.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card icon={<Globe className="size-5" />} title="Web Uygulamaları" desc="Kurumsal web, dashboard, CRM/ERP entegrasyonlu Next.js tabanlı projeler." items={["SEO & Lighthouse 95+","SSR/SSG hibrit","Kurumsal tema"]} />
        <Card icon={<Smartphone className="size-5" />} title="Mobil Uygulamalar" desc="React Native ile iOS/Android, harita, bildirim, cüzdan, kamera/RTSP entegrasyonu." items={["App Store / Play Store","OTA güncellemeler","Yerel modüller"]} />
        <Card icon={<Factory className="size-5" />} title="ERP (Fabrikalar)" desc="Üretim, stok, bakım, kalite, MES entegrasyonu ve yerinde devreye alma." items={["Raporlama & PDF","RLS & yetki","SCADA/IoT köprüleri"]} />
        <Card icon={<Cloud className="size-5" />} title="VIP Cloud Sunucu" desc="Windows / Linux (Ubuntu) özel kaynak; root/RDP erişim, DDoS, snapshot yedek." items={["Ubuntu 22.04/24.04","Windows Server opsiyon","NVMe & yüksek SLA"]} />
      </div>
    </div>
  </Section>
);

// ---------- plans (pricing) ----------
const PlanCard: React.FC<{ name: string; price: string; tagline: string; features: string[]; cta?: string }> = ({ name, price, tagline, features, cta = "Teklif Al" }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-baseline gap-2">
      <h3 className="text-xl font-semibold text-slate-900">{name}</h3>
      <span className="text-xs text-slate-500">{tagline}</span>
    </div>
    <div className="mt-2 text-3xl font-bold text-slate-900">{price}</div>
    <ul className="mt-4 space-y-2 text-sm text-slate-700">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2"><CheckCircle2 className="size-4 mt-0.5 text-emerald-600" />{f}</li>
      ))}
    </ul>
    <a href="#contact" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:opacity-90">{cta} <ArrowRight className="size-4"/></a>
  </div>
);

const Plans: React.FC = () => (
  <Section id="plans" className="py-20 bg-white">
    <div className="mx-auto max-w-7xl">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">VIP Cloud Sunucu Planları</h2>
      <p className="mt-3 text-slate-600 max-w-2xl">Ubuntu 22.04/24.04 ve Windows Server seçenekleriyle yüksek performans, yedekleme ve SLA.</p>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlanCard name="Basic" price="₺/ay" tagline="Giriş seviyesi" features={["2 vCPU / 4 GB RAM","40 GB NVMe","Ubuntu 22.04","Anlık snapshot"]} />
        <PlanCard name="Pro" price="₺/ay" tagline="Yoğun iş yükü" features={["4 vCPU / 8 GB RAM","80 GB NVMe","Ubuntu 24.04","Günlük yedekleme"]} />
        <PlanCard name="Business" price="₺/ay" tagline="Web + DB" features={["8 vCPU / 16 GB RAM","160 GB NVMe","Windows/Ubuntu","7/24 izleme"]} />
        <PlanCard name="Enterprise" price="Teklif" tagline="Yüksek erişilebilir" features={["Cluster / Failover","Özel ağ & DDoS","SLA ≥ 99.9%","Ops ekibi desteği"]} cta="Kurumsal Teklif" />
      </div>
    </div>
  </Section>
);

// ---------- contact ----------
const Contact: React.FC = () => (
  <Section id="contact" className="py-20 bg-gradient-to-t from-sky-50 to-white">
    <div className="mx-auto max-w-5xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Birlikte Çalışalım</h2>
            <p className="mt-3 text-slate-600">Projenizi birkaç başlıkta anlatın, 24 saat içinde dönüş yapalım.</p>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-2"><Mail className="size-4 text-slate-500" /><a className="hover:underline" href="mailto:info@gozcu.com.tr">info@gozcu.com.tr</a></div>
              <div className="flex items-center gap-2"><Phone className="size-4 text-slate-500" /><a className="hover:underline" href="tel:+905551112233">+90 555 111 22 33</a></div>
              <div className="flex items-center gap-2"><MapPin className="size-4 text-slate-500" />İstanbul, Türkiye</div>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 hover:bg-slate-50"><Github className="size-4"/> GitHub</a>
                <a href="#" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 hover:bg-slate-50"><Linkedin className="size-4"/> LinkedIn</a>
                <a href="#" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 inline-flex items-center gap-2 text-sm text-slate-800 hover:bg-slate-50"><Globe className="size-4"/> Blog</a>
              </div>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert("Mesajınız alındı. En kısa sürede dönüş yapacağız."); }} className="grid grid-cols-2 gap-4">
            <input className="col-span-2 sm:col-span-1 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200" placeholder="Adınız Soyadınız" required />
            <input className="col-span-2 sm:col-span-1 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200" placeholder="E-posta" type="email" required />
            <input className="col-span-2 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200" placeholder="Konu" />
            <textarea className="col-span-2 min-h-36 rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-200" placeholder="Kısaca projenizden bahsedin..." />
            <button className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:opacity-90">Gönder <ArrowRight className="size-4"/></button>
          </form>
        </div>
      </div>
    </div>
  </Section>
);

// ---------- footer ----------
const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 bg-white">
    <Section id="footer" className="py-10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 grid place-items-center font-bold text-white">G</div>
          <div>
            <div className="font-semibold text-slate-900">Gözcu Yazılım</div>
            <div className="text-slate-500">© {new Date().getFullYear()} Tüm hakları saklıdır.</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <a className="hover:text-slate-900" href="#about">Hakkımızda</a>
          <a className="hover:text-slate-900" href="#solutions">Çözümler</a>
          <a className="hover:text-slate-900" href="#plans">Planlar</a>
          <a className="hover:text-slate-900" href="#contact">İletişim</a>
        </div>
      </div>
    </Section>
  </footer>
);

// ---------- ana bileşen ----------
export default function GozcuCorporateSiteLight() {
  return (
    <main className="min-h-screen scroll-smooth bg-white text-slate-900">
      <Header />
      <Hero />
      <About />
      <Solutions />
      <Plans />
      <Contact />
      <Footer />
    </main>
  );
}
