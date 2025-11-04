import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  Save,
  X,
  Image,
  FileText,
} from "lucide-react";
import { blogAPI } from "../utils/supabase-api.js";
import { supabase, supabaseAdmin } from "../lib/supabase.js";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({ name: "", surname: "" });

  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Category management states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([
    "Web Tasarım",
    "Güvenlik",
    "ERP",
    "Web Geliştirme",
    "DevOps",
    "Veritabanı",
    "Mobil",
    "Blockchain",
    "Sağlık",
    "Eğitim",
  ]);
  const [newCategory, setNewCategory] = useState("");

  // Load blogs from Supabase
  useEffect(() => {
    console.log("Supabase'den veri yükleniyor...");
    loadBlogs();
    loadAdminInfo();
    // testSupabaseStorage(); // Geçici olarak devre dışı
  }, []);

  // Supabase Storage test fonksiyonu
  const testSupabaseStorage = async () => {
    try {
      console.log("🔍 Supabase Storage test ediliyor...");
      console.log("Supabase client:", supabase);
      console.log("Supabase URL:", supabase.supabaseUrl);
      console.log("Supabase Admin client:", supabaseAdmin);

      // Önce basit bir test yap
      console.log("📊 Database bağlantısı test ediliyor...");
      const { data: testData, error: testError } = await supabase
        .from("blog_posts")
        .select("count")
        .limit(1);

      if (testError) {
        console.error("❌ Supabase bağlantı hatası:", testError);
        alert(
          "❌ Supabase bağlantısı kurulamadı!\n\nLütfen Supabase konfigürasyonunu kontrol edin."
        );
        return;
      }

      console.log("✅ Supabase bağlantısı başarılı");

      // Bucket listesini kontrol et (önce normal client ile)
      console.log("🪣 Normal client ile bucket listesi kontrol ediliyor...");
      let { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      // Eğer normal client ile başarısız olursa, admin client ile dene
      if (bucketsError) {
        console.log("⚠️ Normal client başarısız, admin client deneniyor...");
        console.log("Admin client error:", bucketsError);

        const { data: adminBuckets, error: adminBucketsError } =
          await supabaseAdmin.storage.listBuckets();

        if (adminBucketsError) {
          console.error(
            "❌ Admin client ile de bucket listesi alınamadı:",
            adminBucketsError
          );
          alert(`❌ Bucket listesi alınamadı: ${adminBucketsError.message}`);
          return;
        }

        console.log("✅ Admin client ile bucket listesi alındı:", adminBuckets);
        buckets = adminBuckets;
      } else {
        console.log("✅ Normal client ile bucket listesi alındı:", buckets);
      }

      console.log("📋 Mevcut buckets:", buckets);

      // uploads bucket'ını kontrol et
      const uploadsBucket = buckets.find((bucket) => bucket.id === "uploads");

      if (!uploadsBucket) {
        console.warn("⚠️ 'uploads' bucket'ı bulunamadı!");
        alert(
          "⚠️ Supabase Storage bucket'ı bulunamadı!\n\nLütfen Supabase Dashboard > Storage > New Bucket > 'uploads' oluşturun."
        );
        return;
      }

      console.log("✅ uploads bucket'ı mevcut:", uploadsBucket);

      // Bucket içeriğini kontrol et
      console.log("📁 Bucket içeriği kontrol ediliyor...");
      const { data: files, error: filesError } = await supabase.storage
        .from("uploads")
        .list("blog-images", { limit: 1 });

      if (filesError) {
        console.warn("⚠️ Bucket içeriği kontrol edilemedi:", filesError);
      } else {
        console.log("✅ Bucket içeriği:", files);
      }

      console.log("🎉 Supabase Storage test tamamlandı");
      alert("✅ Supabase Storage başarıyla test edildi!");
    } catch (error) {
      console.error("❌ Supabase Storage test hatası:", error);
      alert(`❌ Supabase Storage test hatası: ${error.message}`);
    }
  };

  const loadAdminInfo = () => {
    // Admin bilgilerini localStorage'dan yükle
    const savedAdminInfo = localStorage.getItem("admin_info");
    console.log("localStorage'dan admin_info:", savedAdminInfo);

    if (savedAdminInfo) {
      const admin = JSON.parse(savedAdminInfo);
      console.log("Parse edilen admin:", admin);
      setAdminInfo({
        name: admin.name || "Admin",
        surname: admin.surname || "User",
      });
    } else {
      console.log(
        "localStorage'da admin_info bulunamadı, varsayılan kullanılıyor"
      );
      // Varsayılan admin bilgileri
      setAdminInfo({
        name: "Admin",
        surname: "User",
      });
    }
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);

      // Admin panelinde admin client kullanarak tüm blogları çek
      const { data, error } = await supabaseAdmin
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Admin blog yükleme hatası:", error);
        alert(`Blog yazıları yüklenirken hata oluştu: ${error.message}`);
        setBlogs([]);
        return;
      }

      console.log("Admin ile yüklenen bloglar:", data);
      setBlogs(data || []);

      // Kategorileri güncelle
      const existingCategories = [
        ...new Set((data || []).map((b) => b.category)),
      ];
      const defaultCategories = [
        "Web Tasarım",
        "Güvenlik",
        "ERP",
        "Mobil",
        "DevOps",
        "Web Geliştirme",
        "Backend",
        "UI/UX",
      ];
      const allCategories = [
        ...new Set([...existingCategories, ...defaultCategories]),
      ];
      setCategories(allCategories);
    } catch (error) {
      console.error("Blog yazıları yüklenirken hata:", error);
      setBlogs([]);
      alert("Blog yazıları yüklenirken hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from blogs and state
  const allCategories = [
    "Tümü",
    ...new Set([
      ...categories,
      ...blogs.map((blog) => blog.category).filter(Boolean),
    ]),
  ];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")
    ) {
      try {
        // Supabase'den sil
        const result = await blogAPI.delete(id);

        if (result.success) {
          alert("Blog yazısı başarıyla silindi!");
          // Blog listesini yeniden yükle
          loadBlogs();
        } else {
          alert(`Blog silinirken hata oluştu: ${result.error}`);
        }
      } catch (error) {
        console.error("Blog silme hatası:", error);
        alert("Blog yazısı silinirken hata oluştu!");
      }
    }
  };

  const handleSave = async (blogData) => {
    try {
      if (editingBlog) {
        // Slug güncelle (eğer başlık değiştiyse)
        let slug = editingBlog.slug; // Mevcut slug'ı koru
        if (blogData.title !== editingBlog.title) {
          // Başlık değiştiyse yeni slug oluştur
          slug =
            blogData.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri kaldır
              .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
              .replace(/-+/g, "-") // Çoklu tireleri tek tire yap
              .trim("-") + // Başta ve sonda tire varsa kaldır
            "-" +
            Date.now(); // Benzersizlik için timestamp ekle
        }

        // Supabase'e güncelle
        const result = await blogAPI.update(editingBlog.id, {
          title: blogData.title,
          slug: slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: blogData.category,
          author: blogData.author,
          featured_image: blogData.featured_image,
          read_time: blogData.readTime,
          status: blogData.status || "published",
          updated_at: new Date().toISOString(),
        });

        if (result.success) {
          alert("Blog yazısı başarıyla güncellendi!");
          // Blog listesini yeniden yükle
          loadBlogs();
        } else {
          alert(`Blog güncellenirken hata oluştu: ${result.error}`);
          return;
        }
      } else {
        // Slug oluştur
        const slug =
          blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Özel karakterleri kaldır
            .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
            .replace(/-+/g, "-") // Çoklu tireleri tek tire yap
            .trim("-") + // Başta ve sonda tire varsa kaldır
          "-" +
          Date.now(); // Benzersizlik için timestamp ekle

        // Supabase'e yeni blog oluştur
        const result = await blogAPI.create({
          title: blogData.title,
          slug: slug,
          excerpt: blogData.excerpt,
          content: blogData.content,
          category: blogData.category,
          author: blogData.author,
          featured_image: blogData.featured_image,
          read_time: blogData.readTime,
          status: "published", // Default olarak yayında
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (result.success) {
          alert("Blog yazısı başarıyla oluşturuldu!");
          // Blog listesini yeniden yükle
          loadBlogs();
        } else {
          alert(`Blog oluşturulurken hata oluştu: ${result.error}`);
          return;
        }
      }
      setShowModal(false);
      setEditingBlog(null);
    } catch (error) {
      console.error("Blog kaydetme hatası:", error);
      alert("Blog yazısı kaydedilirken hata oluştu!");
    }
  };

  // Category management functions
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    if (categoryToRemove !== "Web Tasarım") {
      // Prevent removing default category
      setCategories(categories.filter((cat) => cat !== categoryToRemove));
    }
  };

  const BlogCard = ({ blog }) => (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                blog.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {blog.status === "published" ? "Yayında" : "Taslak"}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {blog.title}
          </h3>
          {blog.featured_image && (
            <div className="mb-3">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {blog.excerpt}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {blog.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {blog.date}
          </div>
          <span>{blog.read_time || blog.readTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEdit(blog)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          <Edit className="w-4 h-4" />
          Düzenle
        </button>
        {blog.status === "draft" ? (
          <button
            onClick={async () => {
              if (confirm("Bu blogu yayınlamak istediğinizden emin misiniz?")) {
                const result = await blogAPI.update(blog.id, {
                  status: "published",
                });
                if (result.success) {
                  alert("Blog yayınlandı!");
                  loadBlogs();
                }
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            Yayınla
          </button>
        ) : (
          <button
            onClick={async () => {
              if (
                confirm("Bu blogu taslağa almak istediğinizden emin misiniz?")
              ) {
                const result = await blogAPI.update(blog.id, {
                  status: "draft",
                });
                if (result.success) {
                  alert("Blog taslağa alındı!");
                  loadBlogs();
                }
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-sm"
          >
            <EyeOff className="w-4 h-4" />
            Taslağa Al
          </button>
        )}
        <button
          onClick={() => handleDelete(blog.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
        >
          <Trash2 className="w-4 h-4" />
          Sil
        </button>
      </div>
    </motion.div>
  );

  const BlogModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[98vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <BlogForm
          blog={editingBlog}
          adminInfo={adminInfo}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingBlog(null);
          }}
        />
      </motion.div>
    </motion.div>
  );

  const BlogForm = ({ blog, adminInfo, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: blog?.title || "",
      excerpt: blog?.excerpt || "",
      category: blog?.category || "",
      author: "",
      readTime: blog?.read_time || blog?.readTime || "",
      content: blog?.content || "",
      featured_image: blog?.featured_image || "",
    });

    // Blog prop'u değiştiğinde formData'yı güncelle
    useEffect(() => {
      console.log("BlogForm useEffect - blog:", blog);
      console.log("BlogForm useEffect - adminInfo:", adminInfo);

      // Yazar adını tam isim olarak ayarla
      let authorName = "";
      if (blog?.author) {
        authorName = blog.author;
      } else {
        const fullName = `${adminInfo.name || ""} ${
          adminInfo.surname || ""
        }`.trim();
        authorName = fullName || "Admin User";
      }
      console.log("Yazar adı:", authorName);

      setFormData({
        title: blog?.title || "",
        excerpt: blog?.excerpt || "",
        category: blog?.category || "",
        author: authorName,
        readTime: blog?.read_time || blog?.readTime || "",
        content: blog?.content || "",
        featured_image: blog?.featured_image || "",
      });
    }, [blog, adminInfo]);

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Dosya boyutu kontrolü (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert("Dosya boyutu 5MB'dan büyük olamaz!");
          return;
        }

        // Dosya tipi kontrolü
        if (!file.type.startsWith("image/")) {
          alert("Sadece görsel dosyaları yükleyebilirsiniz!");
          return;
        }

        // Loading state göster
        const uploadButton = e.target.nextElementSibling;
        const originalText = uploadButton.textContent;
        uploadButton.textContent = "Yükleniyor...";
        uploadButton.disabled = true;

        // Supabase Storage'a yükle
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        console.log("Supabase Storage'a yükleniyor:", filePath);

        // Önce normal client ile dene
        let uploadResult = await supabase.storage
          .from("uploads")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        // Eğer normal client ile başarısız olursa, admin client ile dene
        if (uploadResult.error) {
          console.log("Normal client başarısız, admin client deneniyor...");
          uploadResult = await supabaseAdmin.storage
            .from("uploads")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });
        }

        const { data, error } = uploadResult;

        if (error) {
          console.error("Supabase Storage Upload Error:", error);
          alert(`Görsel yüklenirken hata oluştu: ${error.message}`);
          uploadButton.textContent = originalText;
          uploadButton.disabled = false;
          return;
        }

        // Public URL'i al
        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from("uploads").getPublicUrl(filePath);

        console.log("Supabase'e başarıyla yüklendi:", publicUrl);

        // Form data'yı güncelle
        setFormData((prev) => ({
          ...prev,
          featured_image: publicUrl,
        }));

        alert("Görsel başarıyla yüklendi!");
        uploadButton.textContent = originalText;
        uploadButton.disabled = false;
      } catch (error) {
        console.error("Upload error:", error);
        alert("Görsel yüklenirken hata oluştu!");

        // Button state'i geri yükle
        const uploadButton = e.target.nextElementSibling;
        uploadButton.textContent = "📁 Görsel Seç";
        uploadButton.disabled = false;
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingBlog ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Başlık
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Blog yazısı başlığı"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Öne Çıkan Görsel
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors text-center"
              >
                📁 Görsel Seç
              </label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) =>
                  setFormData({ ...formData, featured_image: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Veya URL girin..."
              />
            </div>
            {formData.featured_image && (
              <div className="mt-2">
                <img
                  src={formData.featured_image}
                  alt="Önizleme"
                  className="w-full h-32 object-cover rounded-lg border border-slate-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Özet
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Blog yazısı özeti"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Okuma Süresi
            </label>
            <input
              type="text"
              value={formData.readTime}
              onChange={(e) =>
                setFormData({ ...formData, readTime: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5 dk"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Yazar
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
            placeholder="Yazar adı (otomatik doldurulur)"
            readOnly
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            İçerik
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="8"
            placeholder="Blog yazısı içeriği"
            required
          />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingBlog ? "Güncelle" : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            İptal
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Blog Yönetimi
          </h2>
          <p className="text-slate-600 mt-1">
            Blog yazılarınızı yönetin ve düzenleyin
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Tag className="w-4 h-4" />
            Kategorileri Düzenle
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yeni Blog Yazısı
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allCategories.map((category) => (
                <option
                  key={category}
                  value={category === "Tümü" ? "all" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Blog yazıları yükleniyor...</p>
            </div>
          </div>
        ) : (
          filteredBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        )}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Blog yazısı bulunamadı
          </h3>
          <p className="text-slate-600">
            Arama kriterlerinize uygun blog yazısı bulunmuyor.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && <BlogModal />}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">
                Kategori Yönetimi
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add new category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Yeni Kategori Ekle
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Kategori adı girin..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category list */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mevcut Kategoriler
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-slate-700">{category}</span>
                    {category !== "Web Tasarım" && (
                      <button
                        onClick={() => removeCategory(category)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogManagement;
