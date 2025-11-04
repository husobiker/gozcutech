import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Heart,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { blogAPI } from "../utils/supabase-api.js";
import NewsletterForm from "../components/NewsletterForm.jsx";
import SEO from "../components/SEO.jsx";
import SEOUtils from "../utils/seo-utils.js";
import SocialShare from "../components/SocialShare.jsx";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadBlogPost();
  }, [id]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      console.log("📝 Blog detay yükleniyor, ID:", id);

      // Önce Supabase'den dene
      const result = await blogAPI.getById(id);

      if (result.success && result.data) {
        console.log("✅ Supabase'den blog yüklendi:", result.data);
        setBlogPost(result.data);

        // İlgili blogları da çek
        const relatedResult = await blogAPI.getAll({
          status: "published",
          limit: 10,
        });

        if (relatedResult.success && relatedResult.data) {
          const related = relatedResult.data
            .filter((p) => p.id !== result.data.id)
            .filter(
              (p) =>
                p.category === result.data.category || !result.data.category
            )
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } else {
        // Fallback: localStorage'dan yükle
        console.log(
          "⚠️ Supabase'den bulunamadı, localStorage kontrol ediliyor..."
        );
        const savedBlogPosts = localStorage.getItem("admin_blogs");

        if (savedBlogPosts) {
          const blogPosts = JSON.parse(savedBlogPosts);
          console.log("📦 Blog posts:", blogPosts);

          const post = blogPosts.find(
            (p) =>
              p.id === parseInt(id) || p.id === id || p.id.toString() === id
          );

          console.log("🔍 Bulunan post:", post);

          if (post) {
            setBlogPost(post);
            // İlgili yazıları bul (aynı kategoriden ve farklı ID'li)
            const related = blogPosts
              .filter((p) => p.id !== post.id && p.status === "published")
              .filter((p) => p.category === post.category || !post.category)
              .slice(0, 2);
            setRelatedPosts(related);
          } else {
            setError("Blog yazısı bulunamadı");
          }
        } else {
          setError("Blog yazısı bulunamadı");
        }
      }
    } catch (error) {
      console.error("❌ Blog detay yüklenirken hata:", error);
      setError("Blog yazısı yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically update the like count in the database
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blogPost.title;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "mail":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(url)}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Blog yazısı yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <div className="mb-4">
            <svg
              className="w-20 h-20 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Bir Hata Oluştu
          </h1>
          <p className="text-slate-600 mb-6 max-w-md">
            {error || "Blog yazısı bulunamadı"}
          </p>
          <div className="flex gap-3 justify-center">
            <motion.button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Tekrar Dene
            </motion.button>
            <Link to="/blog">
              <motion.button
                className="flex items-center gap-2 border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Ana Sayfaya Dön
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Breadcrumb data for SEO
  const breadcrumbs = [
    { name: "Ana Sayfa", url: "https://gozcu.tech/" },
    { name: "Blog", url: "https://gozcu.tech/blog" },
    { name: blogPost.title || "Blog Yazısı", url: `https://gozcu.tech/blog/${blogPost.id}` }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={blogPost.title || "Blog Yazısı"}
        description={blogPost.excerpt || "Blog yazısı"}
        keywords={blogPost.category || "blog"}
        url={`https://gozcu.tech/blog/${blogPost.id}`}
        type="article"
        author={blogPost.author || "Gözcu Yazılım"}
        publishedTime={blogPost.created_at || new Date().toISOString()}
        section={blogPost.category || "Genel"}
        tags={blogPost.tags || []}
        image={blogPost.featured_image || ""}
        breadcrumbs={breadcrumbs}
      />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigate(-1)}
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
              />
            </div>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                to="/"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/blog"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-slate-500">
              <li>
                <Link to="/" className="hover:text-slate-900 transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li className="text-slate-400">/</li>
              <li>
                <Link to="/blog" className="hover:text-slate-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li className="text-slate-400">/</li>
              <li className="text-slate-900 font-medium truncate max-w-xs">
                {blogPost.title}
              </li>
            </ol>
          </nav>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            {/* Category */}
            <div className="flex items-center gap-2 mb-4">
              <Tag className="size-4 text-slate-500" />
              <span className="text-sm text-slate-500">
                {blogPost.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <User className="size-4" />
                {blogPost.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                {new Date(blogPost.created_at).toLocaleDateString("tr-TR")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                {blogPost.read_time || "5"} dk okuma
              </div>
              <div className="flex items-center gap-2">
                <Eye className="size-4" />
                {blogPost.views || 0} görüntüleme
              </div>
            </div>

            {/* Tags */}
            {blogPost.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-slate-500">Paylaş:</span>
              <SocialShare
                url={window.location.href}
                title={blogPost.title}
                description={blogPost.excerpt}
                hashtags={blogPost.tags || []}
                variant="compact"
                showLabel={false}
              />
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {/* Featured Image */}
            {blogPost.featured_image ? (
              <div className="aspect-video overflow-hidden rounded-2xl mb-8">
                <img
                  src={blogPost.featured_image}
                  alt={`${blogPost.title} - Gözcü Yazılım Teknoloji Blog Yazısı`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={630}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-8 flex items-center justify-center">
                <div className="text-slate-400 text-lg">Blog Görseli</div>
              </div>
            )}

            {/* Content */}
            <div className="text-slate-700 leading-relaxed">
              {blogPost.content ? (
                <div className="whitespace-pre-wrap">{blogPost.content}</div>
              ) : (
                <p>{blogPost.excerpt || "İçerik bulunamadı."}</p>
              )}
            </div>
          </motion.div>

          {/* Article Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-slate-200"
          >
            {/* Like Button */}
            <div className="flex items-center justify-between mb-8">
              <motion.button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked
                    ? "bg-red-100 text-red-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Beğendin" : "Beğen"} ({blogPost.likes || 0})
              </motion.button>

              <div className="text-sm text-slate-500">
                {blogPost.views || 0} görüntüleme
              </div>
            </div>

            {/* Author Info */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {blogPost.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {blogPost.author}
                  </h3>
                  <p className="text-sm text-slate-600">Gözcu Yazılım Ekibi</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 transition-colors duration-300">
                  İlgili Yazılar
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="size-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {relatedPost.category || "Genel"}
                        </span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                        {relatedPost.excerpt ||
                          relatedPost.content?.substring(0, 100) + "..." ||
                          "Blog yazısı"}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {relatedPost.created_at
                            ? new Date(
                                relatedPost.created_at
                              ).toLocaleDateString("tr-TR")
                            : "Yeni"}
                        </div>
                        <span>{relatedPost.read_time || "5"} dk</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tüm blogları gör butonu */}
            {relatedPosts.length === 0 && (
              <div className="mb-8 text-center">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium transition-colors duration-300"
                >
                  Tüm Blog Yazılarını Gör
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </motion.footer>
        </div>
      </article>

      {/* Newsletter CTA */}
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
              <Link className="hover:text-slate-900" to="/#about">
                Hakkımızda
              </Link>
              <Link className="hover:text-slate-900" to="/#solutions">
                Hizmetlerimiz
              </Link>
              <Link className="hover:text-slate-900" to="/#plans">
                Planlar
              </Link>
              <Link className="hover:text-slate-900" to="/blog">
                Blog
              </Link>
              <Link className="hover:text-slate-900" to="/#contact">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetail;
