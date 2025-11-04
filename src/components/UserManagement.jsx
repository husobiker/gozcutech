import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Key,
  Calendar,
  Search,
  Filter,
  Save,
  X,
  Check,
  AlertCircle,
  Crown,
  UserCheck,
  UserX,
} from "lucide-react";
import { usersAPI } from "../utils/supabase-api.js";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load users from localStorage
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Supabase'den kullanıcıları çek
      const response = await usersAPI.getAll();

      if (response.success) {
        setUsers(response.data || []);
      } else {
        // Hata durumunda localStorage'dan yükle (fallback)
        const savedUsers = localStorage.getItem("admin_users");
        if (savedUsers) {
          const users = JSON.parse(savedUsers);
          setUsers(users);
        } else {
          // Varsayılan kullanıcıları yükle ve Supabase'e kaydet
          const defaultUsers = [
            {
              email: "admin@gozcu.com.tr",
              name: "Hüseyin",
              surname: "Çetinkoz",
              role: "Super Admin",
              status: "active",
              permissions: ["all"],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              avatar: null,
            },
            {
              email: "editor@gozcu.com.tr",
              name: "Ahmet",
              surname: "Yılmaz",
              role: "Editor",
              status: "active",
              permissions: ["blog", "projects"],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              avatar: null,
            },
            {
              email: "moderator@gozcu.com.tr",
              name: "Mehmet",
              surname: "Kaya",
              role: "Moderator",
              status: "inactive",
              permissions: ["blog"],
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              avatar: null,
            },
          ];

          setUsers(defaultUsers);

          // Supabase'e kaydetmeyi dene
          try {
            for (const user of defaultUsers) {
              await usersAPI.create(user);
            }
          } catch (error) {
            console.log("Supabase'e kaydetme hatası:", error);
          }
        }
      }
    } catch (error) {
      console.error("Kullanıcı yükleme hatası:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "Super Admin",
      label: "Süper Admin",
      color: "bg-red-100 text-red-700",
    },
    { id: "Admin", label: "Admin", color: "bg-purple-100 text-purple-700" },
    { id: "Editor", label: "Editör", color: "bg-blue-100 text-blue-700" },
    {
      id: "Moderator",
      label: "Moderatör",
      color: "bg-green-100 text-green-700",
    },
  ];

  const statuses = [
    { id: "active", label: "Aktif", color: "bg-green-100 text-green-700" },
    { id: "inactive", label: "Pasif", color: "bg-gray-100 text-gray-700" },
    {
      id: "suspended",
      label: "Askıya Alındı",
      color: "bg-red-100 text-red-700",
    },
  ];

  const permissions = [
    { id: "all", label: "Tüm İzinler", description: "Tüm özelliklere erişim" },
    {
      id: "blog",
      label: "Blog Yönetimi",
      description: "Blog yazılarını yönetme",
    },
    {
      id: "projects",
      label: "Proje Yönetimi",
      description: "Projeleri yönetme",
    },
    {
      id: "settings",
      label: "Site Ayarları",
      description: "Site ayarlarını düzenleme",
    },
    {
      id: "users",
      label: "Kullanıcı Yönetimi",
      description: "Kullanıcıları yönetme",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.surname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // Silinecek kullanıcıyı bul
    const userToDelete = users.find((user) => user.id === id);

    // Super Admin kontrolü
    if (
      userToDelete &&
      (userToDelete.role === "Super Admin" || userToDelete.role === "admin")
    ) {
      alert("Super Admin kullanıcısı silinemez!");
      return;
    }

    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await usersAPI.delete(id);

        if (response.success) {
          const updatedUsers = users.filter((user) => user.id !== id);
          setUsers(updatedUsers);
          alert("Kullanıcı başarıyla silindi!");
        } else {
          alert("Kullanıcı silinirken hata oluştu!");
        }
      } catch (error) {
        console.error("Kullanıcı silme hatası:", error);
        alert("Kullanıcı silinirken hata oluştu!");
      }
    }
  };

  const handleSave = async (userData) => {
    try {
      if (editingUser) {
        // Update existing user in Supabase
        const response = await usersAPI.update(editingUser.id, userData);

        if (response.success) {
          // Update local state
          const updatedUsers = users.map((user) =>
            user.id === editingUser.id ? response.data : user
          );
          setUsers(updatedUsers);
          alert("Kullanıcı başarıyla güncellendi!");
        } else {
          alert("Kullanıcı güncellenirken hata oluştu!");
          return;
        }
      } else {
        // Add new user to Supabase
        const newUserData = {
          ...userData,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          avatar: null,
        };

        const response = await usersAPI.create(newUserData);

        if (response.success) {
          // Update local state
          const updatedUsers = [response.data, ...users];
          setUsers(updatedUsers);
          alert("Kullanıcı başarıyla eklendi!");
        } else {
          alert("Kullanıcı eklenirken hata oluştu!");
          return;
        }
      }
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Kullanıcı kaydetme hatası:", error);
      alert("Kullanıcı kaydedilirken hata oluştu!");
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const user = users.find((u) => u.id === id);
      const newStatus = user.status === "active" ? "inactive" : "active";

      const response = await usersAPI.update(id, { status: newStatus });

      if (response.success) {
        const updatedUsers = users.map((user) =>
          user.id === id ? response.data : user
        );
        setUsers(updatedUsers);

        const statusText =
          newStatus === "active" ? "aktifleştirildi" : "pasifleştirildi";
        alert(`Kullanıcı başarıyla ${statusText}!`);
      } else {
        alert("Kullanıcı durumu güncellenirken hata oluştu!");
      }
    } catch (error) {
      console.error("Kullanıcı durumu güncelleme hatası:", error);
      alert("Kullanıcı durumu güncellenirken hata oluştu!");
    }
  };

  const UserCard = ({ user }) => {
    const roleInfo = roles.find((r) => r.id === user.role);
    const statusInfo = statuses.find((s) => s.id === user.status);

    return (
      <motion.div
        className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all h-full flex flex-col"
        whileHover={{ y: -2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-900 truncate">
                {user.name || user.username || "İsimsiz"} {user.surname || ""}
              </h3>
              {user.role === "Super Admin" && (
                <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-slate-600 text-sm mb-3 truncate">{user.email}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  roleInfo?.color || "bg-gray-100 text-gray-700"
                }`}
              >
                {roleInfo?.label || user.role}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusInfo?.color || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusInfo?.label || user.status}
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {user.created_at || user.createdAt
                ? new Date(
                    user.created_at || user.createdAt
                  ).toLocaleDateString("tr-TR")
                : "Bilinmiyor"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>{(user.permissions || []).length} izin</span>
          </div>
        </div>

        {/* Last Login Info */}
        <div className="text-xs text-slate-400 mb-4">
          Son Giriş:{" "}
          {user.last_login || user.lastLogin
            ? new Date(user.last_login || user.lastLogin).toLocaleString(
                "tr-TR"
              )
            : "Hiç giriş yapmadı"}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={() => handleEdit(user)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex-1 justify-center"
          >
            <Edit className="w-4 h-4" />
            Düzenle
          </button>
          <button
            onClick={() => toggleUserStatus(user.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-sm flex-1 justify-center ${
              user.status === "active"
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {user.status === "active" ? (
              <>
                <UserX className="w-4 h-4" />
                Pasifleştir
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Aktifleştir
              </>
            )}
          </button>
          {/* Super Admin'i silme */}
          {user.role !== "Super Admin" && user.role !== "admin" && (
            <button
              onClick={() => handleDelete(user.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm flex-1 justify-center"
            >
              <Trash2 className="w-4 h-4" />
              Sil
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  const UserModal = () => (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
        />
      </motion.div>
    </motion.div>
  );

  const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: user?.name || "",
      surname: user?.surname || "",
      email: user?.email || "",
      role: user?.role || "Editor",
      status: user?.status || "active",
      permissions: user?.permissions || [],
    });

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      const userData = { ...formData };

      // Şifre işleme
      if (password && password.trim() !== "") {
        userData.password = password;
      }

      onSave(userData);
    };

    const togglePermission = (permissionId) => {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.includes(permissionId)
          ? prev.permissions.filter((p) => p !== permissionId)
          : [...prev.permissions, permissionId],
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {editingUser ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ad
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
              Soyad
            </label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Şifre Alanı - Yeni kullanıcı için zorunlu, düzenleme için opsiyonel */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Şifre {!editingUser && <span className="text-red-500">*</span>}
            {editingUser && (
              <span className="text-slate-500 text-sm">
                (Boş bırakırsanız mevcut şifre korunur)
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={
                editingUser ? "Yeni şifre girin (opsiyonel)" : "Şifre girin"
              }
              required={!editingUser}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Durum
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            İzinler
          </label>
          <div className="space-y-2">
            {permissions.map((permission) => (
              <label
                key={permission.id}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {permission.label}
                  </div>
                  <div className="text-sm text-slate-500">
                    {permission.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            {editingUser ? "Güncelle" : "Kaydet"}
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Kullanıcılar yükleniyor...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Kullanıcı Yönetimi
              </h2>
              <p className="text-slate-600 mt-1">
                Sistem kullanıcılarını yönetin ve izinlerini düzenleyin
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yeni Kullanıcı Ekle
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {users.length}
                  </div>
                  <div className="text-sm text-slate-600">Toplam Kullanıcı</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <div className="text-sm text-slate-600">Aktif Kullanıcı</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {users.filter((u) => u.role === "super_admin").length}
                  </div>
                  <div className="text-sm text-slate-600">Süper Admin</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {users.filter((u) => u.role === "editor").length}
                  </div>
                  <div className="text-sm text-slate-600">Editör</div>
                </div>
              </div>
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
                    placeholder="Kullanıcılarda ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Roller</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tüm Durumlar</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Kullanıcı bulunamadı
              </h3>
              <p className="text-slate-600">
                Arama kriterlerinize uygun kullanıcı bulunmuyor.
              </p>
            </div>
          )}

          {/* Modal */}
          {showModal && <UserModal />}
        </>
      )}
    </div>
  );
};

export default UserManagement;
