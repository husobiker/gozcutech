import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { blogAPI } from "../utils/supabase-api.js";
import NewsletterForm from "../components/NewsletterForm.jsx";
import SEO from "../components/SEO.jsx";
import {
  BlogCardSkeleton,
  LoadingSpinner,
} from "../components/skeletons/index.js";

const Blog = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);

      // Supabase'den blog yazılarını yükle
      console.log("📝 Blog yazıları yükleniyor...");
      const result = await blogAPI.getAll({
        status: "published",
        limit: 50,
      });

      if (result.success && result.data && result.data.length > 0) {
        console.log("✅ Blog yazıları yüklendi:", result.data);
        setBlogPosts(result.data);
        // localStorage'a da kaydet (cache için)
        localStorage.setItem("admin_blogs", JSON.stringify(result.data));
      } else {
        console.log(
          "⚠️ Supabase'den blog bulunamadı, localStorage kontrol ediliyor..."
        );
        // Fallback: localStorage'dan yükle
        const savedBlogPosts = localStorage.getItem("admin_blogs");
        if (savedBlogPosts) {
          const parsed = JSON.parse(savedBlogPosts);
          console.log("📦 localStorage'dan bloglar yüklendi:", parsed);
          setBlogPosts(parsed);
        } else {
          console.log(
            "ℹ️ Veritabanında blog yazısı bulunmuyor. Admin panelinden blog ekleyebilirsiniz."
          );
          setBlogPosts([]);
        }
      }
    } catch (error) {
      console.error("❌ Blog yazıları yüklenirken hata:", error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from blog posts
  const categories = [
    "Tümü",
    ...new Set(blogPosts.map((post) => post.category).filter(Boolean)),
  ];

  // Filter blog posts based on search and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tümü" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SEO
          title="Blog - Teknoloji Yazıları"
          description="Web tasarım, bulut sunucu, ERP sistemleri ve yazılım geliştirme konularında uzman görüşleri ve güncel bilgiler."
          keywords="blog, teknoloji, web tasarım, ERP, bulut sunucu, yazılım geliştirme, Gözcu Yazılım"
          url="https://gozcu.tech/blog"
          type="website"
        />

        {/* Header Skeleton */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section Skeleton */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <div className="h-12 w-64 bg-slate-200 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-96 bg-slate-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-slate-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Skeleton */}
        <section className="py-8 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-16 bg-slate-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
              <div className="w-full md:w-64">
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Skeleton */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Skeleton */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <div className="h-8 w-64 bg-slate-200 rounded animate-pulse mx-auto mb-4"></div>
              <div className="h-6 w-96 bg-slate-200 rounded animate-pulse mx-auto mb-8"></div>
              <div className="h-12 w-80 bg-slate-200 rounded-lg animate-pulse mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Footer Skeleton */}
        <footer className="bg-white border-t border-slate-200 py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-32 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-16 bg-slate-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Blog - Teknoloji Yazıları"
        description="Web tasarım, bulut sunucu, ERP sistemleri ve yazılım geliştirme konularında uzman görüşleri ve güncel bilgiler."
        keywords="blog, teknoloji, web tasarım, ERP, bulut sunucu, yazılım geliştirme, Gözcu Yazılım"
        url="https://gozcu.tech/blog"
        type="website"
      />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="size-4" />
                Geri
              </motion.button>
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-10 w-auto object-contain"
                width="216"
                height="84"
                loading="eager"
              />
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <a
                href="/"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Ana Sayfa
              </a>
              <a
                href="/#about"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Hakkımızda
              </a>
              <a
                href="/#contact"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                İletişim
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Teknoloji Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Web tasarım, bulut sunucu, ERP sistemleri ve yazılım geliştirme
              konularında uzman görüşleri ve güncel bilgiler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {filteredPosts.length === 0 && blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Henüz blog yazısı bulunmuyor
              </h3>
              <p className="text-slate-600 text-lg mb-4">
                Admin panelinden blog ekleyerek başlayabilirsiniz.
              </p>
              <a
                href="/admin"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Admin Panele Git
              </a>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-600 text-lg">
                Arama kriterlerinize uygun blog yazısı bulunamadı.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
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
                        width="400"
                        height="225"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <div className="text-slate-400 text-sm">
                          Blog Görseli
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-slate-400 text-sm">Blog Görseli</div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="size-4 text-slate-500" />
                      <span className="text-sm text-slate-500">
                        {post.category || "Genel"}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content?.substring(0, 150) + "..."}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="size-4" />
                          {post.author || "Gözcu Yazılım"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {post.created_at
                            ? new Date(post.created_at).toLocaleDateString(
                                "tr-TR",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Yeni"}
                        </div>
                      </div>
                      <span>
                        {post.read_time ? `${post.read_time} dk` : "5 dk"}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => navigate(`/blog/${post.id}`)}
                      className="w-full bg-slate-900 text-white py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Devamını Oku
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-4xl px-6">
          <NewsletterForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-8 w-auto object-contain"
              />
              <div>
                <div className="font-semibold text-slate-900">
                  Gözcu Yazılım
                </div>
                <div className="text-slate-500">
                  © {new Date().getFullYear()} Tüm hakları saklıdır.
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <a className="hover:text-slate-900" href="/#about">
                Hakkımızda
              </a>
              <a className="hover:text-slate-900" href="/#solutions">
                Hizmetlerimiz
              </a>
              <a className="hover:text-slate-900" href="/#plans">
                Planlar
              </a>
              <a className="hover:text-slate-900" href="/blog">
                Blog
              </a>
              <a className="hover:text-slate-900" href="/#contact">
                İletişim
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
