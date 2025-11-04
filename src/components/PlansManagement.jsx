import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Save,
  Server,
  Globe,
  Monitor,
} from "lucide-react";
import { plansAPI } from "../utils/supabase-api.js";

const PlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("bulut");
  const [selectedServerType, setSelectedServerType] = useState("linux");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    tagline: "",
    features: [],
    plan_type: "bulut",
    server_type: "linux",
    cta_text: "Teklif Al",
    featured: false,
    status: "active",
    sort_order: 0,
  });
  const [newFeature, setNewFeature] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);

  // Ana sayfadaki plan yapısı
  const planCategories = {
    bulut: {
      title: "VIP Bulut Sunucu Planları",
      icon: Server,
      color: "blue",
      subCategories: {
        linux: {
          title: "Linux Sunucu Planları",
          color: "emerald",
          plans: [],
        },
        windows: {
          title: "Windows Sunucu Planları",
          color: "blue",
          plans: [],
        },
      },
    },
    web: {
      title: "Web Tasarım Planları",
      icon: Globe,
      color: "purple",
      plans: [],
    },
    yazilim: {
      title: "Özel Yazılım Planları",
      icon: Monitor,
      color: "indigo",
      plans: [],
    },
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const result = await plansAPI.getAll();
      if (result.success) {
        setPlans(result.data || []);
      } else {
        // Fallback: localStorage'dan yükle
        const savedPlans = localStorage.getItem("admin_plans");
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans));
        }
      }
    } catch (error) {
      console.error("Planlar yüklenirken hata:", error);
      // Fallback: localStorage'dan yükle
      const savedPlans = localStorage.getItem("admin_plans");
      if (savedPlans) {
        setPlans(JSON.parse(savedPlans));
      }
    } finally {
      setLoading(false);
    }
  };

  const getPlansByCategory = (category, serverType = null) => {
    if (category === "bulut" && serverType) {
      return plans.filter(
        (plan) => plan.plan_type === category && plan.server_type === serverType
      );
    }
    return plans.filter((plan) => plan.plan_type === category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaveStatus("saving");

      const planData = {
        ...formData,
        features: formData.features,
      };

      let result;
      if (editingPlan) {
        result = await plansAPI.update(editingPlan.id, planData);
      } else {
        result = await plansAPI.create(planData);
      }

      if (result.success) {
        setSaveStatus("success");
        await loadPlans();
        resetForm();
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error("Plan kaydedilirken hata:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      tagline: plan.tagline,
      features: plan.features || [],
      plan_type: plan.plan_type || "bulut",
      server_type: plan.server_type || "linux",
      cta_text: plan.cta_text || "Teklif Al",
      featured: plan.featured || false,
      status: plan.status || "active",
      sort_order: plan.sort_order || 0,
    });
    setSelectedCategory(plan.plan_type || "bulut");
    setSelectedServerType(plan.server_type || "linux");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu planı silmek istediğinizden emin misiniz?")) {
      try {
        const result = await plansAPI.delete(id);
        if (result.success) {
          await loadPlans();
        }
      } catch (error) {
        console.error("Plan silinirken hata:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      tagline: "",
      features: [],
      plan_type: "bulut",
      server_type: "linux",
      cta_text: "Teklif Al",
      featured: false,
      status: "active",
      sort_order: 0,
    });
    setNewFeature("");
    setEditingPlan(null);
    setShowForm(false);
    setSelectedCategory("bulut");
    setSelectedServerType("linux");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const PlanCard = ({ plan }) => (
    <motion.div
      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {plan.name}
            </h3>
            {plan.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                Öne Çıkan
              </span>
            )}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                plan.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {plan.status === "active" ? "Aktif" : "Pasif"}
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-2">{plan.tagline}</p>
          <p className="text-xl font-bold text-slate-900 mb-3">{plan.price}</p>
          <div className="text-sm text-slate-500 mb-3">
            {plan.plan_type === "bulut" ? (
              <span className="flex items-center gap-1">
                <Server className="w-4 h-4" />
                {plan.server_type === "linux"
                  ? "Linux Sunucu"
                  : "Windows Sunucu"}
              </span>
            ) : plan.plan_type === "web" ? (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Web Tasarım
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Monitor className="w-4 h-4" />
                Özel Yazılım
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(plan)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(plan.id)}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">Özellikler:</h4>
        <ul className="space-y-1">
          {(plan.features || []).slice(0, 3).map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
              {feature}
            </li>
          ))}
          {(plan.features || []).length > 3 && (
            <li className="text-xs text-slate-500">
              +{(plan.features || []).length - 3} özellik daha
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Plan Yönetimi</h1>
            <p className="text-slate-600 mt-2">
              Hizmet planlarınızı kategorilere göre yönetin
            </p>
          </div>
          <motion.button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Yeni Plan
          </motion.button>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {Object.entries(planCategories).map(([key, category]) => {
              const Icon = category.icon;
              const isActive = selectedCategory === key;
              const colorClasses = {
                blue: "bg-blue-100 text-blue-700 border-blue-200",
                emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
                purple: "bg-purple-100 text-purple-700 border-purple-200",
                indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
              };

              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    if (key === "bulut") {
                      setSelectedServerType("linux");
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    isActive
                      ? colorClasses[category.color]
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.title}
                </button>
              );
            })}
          </div>

          {/* Server Type Selector for Bulut */}
          {selectedCategory === "bulut" && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedServerType("linux")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedServerType === "linux"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <Server className="w-4 h-4" />
                Linux Sunucu
              </button>
              <button
                onClick={() => setSelectedServerType("windows")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  selectedServerType === "windows"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                }`}
              >
                <Server className="w-4 h-4" />
                Windows Sunucu
              </button>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPlansByCategory(
              selectedCategory,
              selectedCategory === "bulut" ? selectedServerType : null
            ).map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          getPlansByCategory(
            selectedCategory,
            selectedCategory === "bulut" ? selectedServerType : null
          ).length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <Server className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Bu kategoride plan bulunamadı
              </h3>
              <p className="text-slate-500 mb-4">
                Yeni bir plan eklemek için yukarıdaki "Yeni Plan" butonunu
                kullanın.
              </p>
            </div>
          )}
      </motion.div>

      {/* Plan Form Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingPlan ? "Planı Düzenle" : "Yeni Plan Ekle"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fiyat
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="₺299/ay"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Giriş seviyesi plan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Plan Türü
                  </label>
                  <select
                    value={formData.plan_type}
                    onChange={(e) => {
                      setFormData({ ...formData, plan_type: e.target.value });
                      setSelectedCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="bulut">VIP Bulut Sunucu</option>
                    <option value="web">Web Tasarım</option>
                    <option value="yazilim">Özel Yazılım</option>
                  </select>
                </div>

                {formData.plan_type === "bulut" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Sunucu Türü
                    </label>
                    <select
                      value={formData.server_type}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          server_type: e.target.value,
                        });
                        setSelectedServerType(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="linux">Linux</option>
                      <option value="windows">Windows</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Özellikler
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Yeni özellik ekle..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addFeature())
                      }
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="space-y-1">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                      >
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="flex-1 text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Öne Çıkan Plan
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? "active" : "inactive",
                      })
                    }
                    className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Aktif
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saveStatus === "saving"}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === "saving" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingPlan ? "Güncelle" : "Kaydet"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PlansManagement;
