import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  Save,
  X,
  Image,
  Code,
  Building,
  Globe,
  Server,
  Database,
  Star,
  Award,
  Clock,
} from "lucide-react";
import { projectsAPI } from "../utils/supabase-api.js";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Load projects from Supabase
  useEffect(() => {
    loadProjects();
  }, []);

  // Kategori yönetimi fonksiyonları
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    const updatedCategories = categories.filter(
      (cat) => cat !== categoryToRemove
    );
    setCategories(updatedCategories);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);

      // Önce localStorage'dan yükle (hızlı başlangıç için)
      const savedProjects = localStorage.getItem("admin_projects");
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        setProjects(projects);

        // Kategorileri yükle
        const existingCategories = [
          ...new Set(projects.map((p) => p.category)),
        ];
        const defaultCategories = [
          "ERP",
          "E-Ticaret",
          "Mobil",
          "Web Tasarım",
          "Bulut",
          "AI/ML",
        ];
        const allCategories = [
          ...new Set([...existingCategories, ...defaultCategories]),
        ];
        setCategories(allCategories);
      }

      // Supabase'den projeleri yükle (arka planda)
      try {
        const result = await projectsAPI.getAll({ limit: 50 });
        if (result.success) {
          setProjects(result.data);
          localStorage.setItem("admin_projects", JSON.stringify(result.data));

          // Kategorileri güncelle
          const existingCategories = [
            ...new Set(result.data.map((p) => p.category)),
          ];
          const defaultCategories = [
            "ERP",
            "E-Ticaret",
            "Mobil",
            "Web Tasarım",
            "Bulut",
            "AI/ML",
          ];
          const allCategories = [
            ...new Set([...existingCategories, ...defaultCategories]),
          ];
          setCategories(allCategories);
        }
      } catch (supabaseError) {
        console.log("Supabase bağlantısı yok, localStorage kullanılıyor");
      }
    } catch (error) {
      console.error("Projeler yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      try {
        // Önce localStorage'dan sil
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
        localStorage.setItem("admin_projects", JSON.stringify(updatedProjects));
        alert("Proje başarıyla silindi!");

        // Supabase'den sil (arka planda)
        try {
          await projectsAPI.delete(id);
        } catch (supabaseError) {
          console.log(
            "Supabase bağlantısı yok, sadece localStorage güncellendi"
          );
        }
      } catch (error) {
        console.error("Proje silme hatası:", error);
        alert("Proje silinirken hata oluştu!");
      }
    }
  };

  const handleSave = async (projectData) => {
    try {
      if (editingProject) {
        // Önce localStorage'da güncelle
        const updatedProjects = projects.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...projectData }
            : project
        );
        setProjects(updatedProjects);
        localStorage.setItem("admin_projects", JSON.stringify(updatedProjects));
        alert("Proje başarıyla güncellendi!");

        // Supabase'e kaydet (arka planda)
        try {
          await projectsAPI.update(editingProject.id, projectData);
        } catch (supabaseError) {
          console.log(
            "Supabase bağlantısı yok, sadece localStorage güncellendi"
          );
        }
      } else {
        // Önce localStorage'da oluştur
        const newProject = {
          id: Date.now(),
          ...projectData,
          created_at: new Date().toISOString().split("T")[0],
        };
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        localStorage.setItem("admin_projects", JSON.stringify(updatedProjects));
        alert("Proje başarıyla oluşturuldu!");

        // Supabase'e kaydet (arka planda)
        try {
          await projectsAPI.create(projectData);
        } catch (supabaseError) {
          console.log(
            "Supabase bağlantısı yok, sadece localStorage güncellendi"
          );
        }
      }
      setShowModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error("Proje kaydetme hatası:", error);
      alert("Proje kaydedilirken hata oluştu!");
    }
  };

  const ProjectCard = ({ project }) => (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
            {project.logo_data ? (
              <img
                src={project.logo_data}
                alt={`${project.company} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
            ) : null}
            <span style={{ display: project.logo_data ? "none" : "block" }}>
              {project.logo || "🏢"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {project.project_name}
            </h3>
            <p className="text-sm text-slate-600">{project.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          )}
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              project.status === "completed"
                ? "bg-green-100 text-green-800"
                : project.status === "active"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {project.status === "completed"
              ? "Tamamlandı"
              : project.status === "active"
              ? "Aktif"
              : "Beklemede"}
          </span>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {project.year}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {project.duration}
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {project.team_size}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {project.technologies?.slice(0, 3).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded"
          >
            {tech}
          </span>
        ))}
        {project.technologies?.length > 3 && (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
            +{project.technologies.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{project.category}</span>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => handleEdit(project)}
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={() => handleDelete(project.id)}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Proje Yönetimi</h2>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Tag className="w-4 h-4" />
            Kategorileri Düzenle
          </motion.button>
          <motion.button
            onClick={() => {
              setEditingProject(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Yeni Proje
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Projelerde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
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

      {/* Project List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Projeler yükleniyor...</p>
            </div>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Proje bulunamadı
          </h3>
          <p className="text-slate-600">
            Arama kriterlerinize uygun proje bulunmuyor.
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProject ? "Proje Düzenle" : "Yeni Proje"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);

                // Logo dosyası işleme
                let logoData = null;
                const logoFile = formData.get("logo_file");
                if (logoFile && logoFile.size > 0) {
                  logoData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      resolve(event.target.result);
                    };
                    reader.readAsDataURL(logoFile);
                  });
                }

                const projectData = {
                  company: formData.get("company"),
                  project_name: formData.get("project_name"),
                  description: formData.get("description"),
                  category: formData.get("category"),
                  year: parseInt(formData.get("year")),
                  duration: formData.get("duration"),
                  team_size: formData.get("team_size"),
                  technologies: formData
                    .get("technologies")
                    .split(",")
                    .map((t) => t.trim()),
                  challenges: formData
                    .get("challenges")
                    .split(",")
                    .map((c) => c.trim()),
                  results: formData
                    .get("results")
                    .split(",")
                    .map((r) => r.trim()),
                  featured: formData.get("featured") === "on",
                  status: formData.get("status"),
                  logo_data: logoData, // Base64 encoded logo data
                };
                handleSave(projectData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingProject?.company || ""}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Proje Adı
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    defaultValue={editingProject?.project_name || ""}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Müşteri Logosu
                  </label>
                  <input
                    type="file"
                    name="logo_file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const logoPreview =
                            document.getElementById("logo-preview");
                          if (logoPreview) {
                            logoPreview.src = event.target.result;
                            logoPreview.style.display = "block";
                            logoPreview.nextSibling.style.display = "none";
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, SVG formatlarında logo yükleyin
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Logo Önizleme
                  </label>
                  <div className="w-full h-12 border border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                    <img
                      id="logo-preview"
                      alt="Logo"
                      className="max-h-8 max-w-24 object-contain"
                      style={{ display: "none" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <span className="text-slate-400 text-sm">
                      Logo dosyası seçin
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProject?.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    defaultValue={editingProject?.category || ""}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seçiniz</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Yıl
                  </label>
                  <input
                    type="number"
                    name="year"
                    defaultValue={
                      editingProject?.year || new Date().getFullYear()
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Durum
                  </label>
                  <select
                    name="status"
                    defaultValue={editingProject?.status || "active"}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="archived">Arşivlendi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Süre
                  </label>
                  <input
                    type="text"
                    name="duration"
                    defaultValue={editingProject?.duration || ""}
                    placeholder="6 ay"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ekip Büyüklüğü
                  </label>
                  <input
                    type="text"
                    name="team_size"
                    defaultValue={editingProject?.team_size || ""}
                    placeholder="5 kişi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teknolojiler (virgülle ayırın)
                </label>
                <input
                  type="text"
                  name="technologies"
                  defaultValue={editingProject?.technologies?.join(", ") || ""}
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Zorluklar (virgülle ayırın)
                </label>
                <input
                  type="text"
                  name="challenges"
                  defaultValue={editingProject?.challenges?.join(", ") || ""}
                  placeholder="Yüksek trafik, Güvenlik"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sonuçlar (virgülle ayırın)
                </label>
                <input
                  type="text"
                  name="results"
                  defaultValue={editingProject?.results?.join(", ") || ""}
                  placeholder="%40 hızlanma, %25 maliyet azalması"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editingProject?.featured || false}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-slate-700">
                  Öne Çıkan Proje
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProject ? "Güncelle" : "Oluştur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kategori Yönetimi Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                Kategori Yönetimi
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Yeni Kategori Ekleme */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Yeni kategori adı"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ekle
                </button>
              </div>

              {/* Mevcut Kategoriler */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">
                  Mevcut Kategoriler:
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                    >
                      <span className="text-slate-700">{category}</span>
                      <button
                        onClick={() => removeCategory(category)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
