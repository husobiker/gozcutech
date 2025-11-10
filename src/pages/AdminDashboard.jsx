import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
  Globe,
  Server,
  Code,
  Database,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import BlogManagement from "../components/BlogManagement.jsx";
import ProjectManagement from "../components/ProjectManagement.jsx";
import SiteSettings from "../components/SiteSettings.jsx";
import UserManagement from "../components/UserManagement.jsx";
import PlansManagement from "../components/PlansManagement.jsx";
import NewsletterManagement from "../components/NewsletterManagement.jsx";
import ContactMessages from "../components/ContactMessages.jsx";
import { analyticsAPI } from "../utils/supabase-api.js";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBlogs: 0,
    totalPlans: 0,
    totalVisitors: 0,
    totalRevenue: 0,
    totalSubscribers: 0,
    totalMessages: 0,
    newMessages: 0,
  });

  // Check authentication and load data
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminUser = localStorage.getItem("admin_user");
    const adminInfo = localStorage.getItem("admin_info");

    console.log("🔐 Admin Token:", token ? "Var" : "Yok");
    console.log("👤 Admin User:", adminUser);
    console.log("ℹ️ Admin Info:", adminInfo);

    if (!token || !adminUser) {
      window.location.href = "/admin";
    } else {
      // Admin bilgilerini name + surname olarak ayarla
      if (adminInfo) {
        try {
          const info = JSON.parse(adminInfo);
          console.log("📝 Parsed admin info:", info);
          const fullName = `${info.name || ""} ${info.surname || ""}`.trim();
          console.log("👋 Tam isim:", fullName);
          setUser(fullName || adminUser);
        } catch (error) {
          console.error("❌ Admin info parse hatası:", error);
          setUser(adminUser); // Fallback to email
        }
      } else {
        console.log("⚠️ Admin info yok, email kullanılıyor");
        setUser(adminUser); // Fallback to email
      }
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      // Backend'den gerçek istatistikleri yükle
      const [blogsResponse, projectsResponse, plansResponse] =
        await Promise.all([
          fetch("/api/blog"),
          fetch("/api/projects"),
          fetch("/api/plans"),
        ]);

      const blogs = blogsResponse.ok ? await blogsResponse.json() : [];
      const projects = projectsResponse.ok ? await projectsResponse.json() : [];
      const plans = plansResponse.ok ? await plansResponse.json() : [];

      setStats({
        totalProjects: projects.length,
        totalBlogs: blogs.length,
        totalPlans: plans.length,
        totalVisitors: 1247, // Bu gerçek analytics'ten gelecek
        totalRevenue: 45600, // Bu gerçek verilerden hesaplanacak
      });
    } catch (error) {
      console.error("Dashboard verileri yüklenirken hata:", error);
      // Fallback değerler
      setStats({
        totalProjects: 0,
        totalBlogs: 0,
        totalPlans: 0,
        totalVisitors: 0,
        totalRevenue: 0,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin";
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p
              className={`text-sm mt-1 ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% bu ay
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <motion.button
      onClick={onClick}
      className="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-200 text-left hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </motion.button>
  );

  const RecentActivity = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Son Aktiviteler
      </h3>
      <div className="space-y-4">
        {[
          {
            action: "Yeni blog yazısı eklendi",
            time: "2 saat önce",
            type: "blog",
          },
          {
            action: "Proje referansı güncellendi",
            time: "4 saat önce",
            type: "project",
          },
          {
            action: "Site ayarları değiştirildi",
            time: "1 gün önce",
            type: "settings",
          },
          { action: "Yeni kullanıcı kaydı", time: "2 gün önce", type: "user" },
        ].map((activity, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                activity.type === "blog"
                  ? "bg-blue-500"
                  : activity.type === "project"
                  ? "bg-green-500"
                  : activity.type === "settings"
                  ? "bg-purple-500"
                  : "bg-orange-500"
              }`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {activity.action}
              </p>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="p-6 h-full">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Gözcu Yazılım Logo"
            className="h-16 w-auto object-contain"
            width="216"
            height="84"
            loading="eager"
          />
        </div>
        <div className="text-sm text-slate-600">Hoş geldin,</div>
        <div className="text-sm font-semibold text-slate-900 mb-4">{user}</div>
      </div>

      <nav className="space-y-2">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "projects", label: "Projeler", icon: Code },
          { id: "blog", label: "Blog Yazıları", icon: FileText },
          { id: "plans", label: "Planlar", icon: Server },
          { id: "newsletter", label: "Newsletter", icon: Bell },
          { id: "messages", label: "Mesajlar", icon: Globe },
          { id: "settings", label: "Site Ayarları", icon: Settings },
          { id: "users", label: "Kullanıcılar", icon: Users },
        ].map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Proje"
          value={stats.totalProjects}
          icon={Code}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Blog Yazıları"
          value={stats.totalBlogs}
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Planlar"
          value={stats.totalPlans}
          icon={Server}
          color="bg-purple-500"
        />
        <StatCard
          title="Ziyaretçi"
          value={stats.totalVisitors.toLocaleString()}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Hızlı İşlemler
            </h3>
            <div className="space-y-3">
              <QuickAction
                title="Yeni Blog Yazısı"
                description="Blog'a yeni içerik ekle"
                icon={Plus}
                color="bg-blue-500"
                onClick={() => setActiveTab("blog")}
              />
              <QuickAction
                title="Proje Ekle"
                description="Yeni proje referansı ekle"
                icon={Code}
                color="bg-green-500"
                onClick={() => setActiveTab("projects")}
              />
              <QuickAction
                title="Site Ayarları"
                description="Genel ayarları düzenle"
                icon={Settings}
                color="bg-purple-500"
                onClick={() => setActiveTab("settings")}
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r border-slate-200 flex-shrink-0 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Gözcu Yazılım CMS Yönetim Paneli
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Bildirimler</span>
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Siteyi Görüntüle
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              {activeTab === "dashboard" && <DashboardContent />}
              {activeTab === "projects" && <ProjectManagement />}
              {activeTab === "blog" && <BlogManagement />}
              {activeTab === "plans" && <PlansManagement />}
              {activeTab === "newsletter" && <NewsletterManagement />}
              {activeTab === "messages" && <ContactMessages />}
              {activeTab === "settings" && <SiteSettings />}
              {activeTab === "users" && <UserManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
