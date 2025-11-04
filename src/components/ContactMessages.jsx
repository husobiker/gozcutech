import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  Reply,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Download,
  Archive,
} from "lucide-react";
import { contactsAPI } from "../utils/supabase-api.js";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);

      // Supabase'den gerçek verileri çek
      const result = await contactsAPI.getAll();

      if (result.success) {
        setMessages(result.data || []);
      } else {
        console.error("Mesajlar yüklenirken hata:", result.error);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      const result = await contactsAPI.updateStatus(id, newStatus);
      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, status: newStatus } : msg
          )
        );
      } else {
        console.error("Status güncellenirken hata:", result.error);
      }
    } catch (error) {
      console.error("Status güncellenirken hata:", error);
    }
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedMessages.length === 0) return;

    switch (action) {
      case "delete":
        if (
          window.confirm(
            `${selectedMessages.length} mesajı silmek istediğinizden emin misiniz?`
          )
        ) {
          setMessages((prev) =>
            prev.filter((msg) => !selectedMessages.includes(msg.id))
          );
          setSelectedMessages([]);
        }
        break;
      case "mark_read":
        setMessages((prev) =>
          prev.map((msg) =>
            selectedMessages.includes(msg.id) ? { ...msg, status: "read" } : msg
          )
        );
        setSelectedMessages([]);
        break;
      case "mark_replied":
        setMessages((prev) =>
          prev.map((msg) =>
            selectedMessages.includes(msg.id)
              ? { ...msg, status: "replied" }
              : msg
          )
        );
        setSelectedMessages([]);
        break;
    }
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map((msg) => msg.id));
    }
  };

  const exportMessages = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Project Type", "Message", "Status", "Date"],
      ...filteredMessages.map((msg) => [
        msg.name,
        msg.email,
        msg.phone || "",
        msg.project_type,
        msg.message.replace(/\n/g, " "),
        msg.status,
        new Date(msg.created_at).toLocaleDateString("tr-TR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-messages-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "new":
        return "Yeni";
      case "read":
        return "Okundu";
      case "replied":
        return "Yanıtlandı";
      case "closed":
        return "Kapandı";
      default:
        return "Bilinmiyor";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4" />;
      case "read":
        return <Eye className="w-4 h-4" />;
      case "replied":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <Archive className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            İletişim Mesajları
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {messages.length} toplam mesaj
          </p>
        </div>

        <div className="flex gap-2">
          <motion.button
            onClick={exportMessages}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Dışa Aktar
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="İsim, e-posta veya mesaj ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="new">Yeni</option>
          <option value="read">Okundu</option>
          <option value="replied">Yanıtlandı</option>
          <option value="closed">Kapandı</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              {selectedMessages.length} mesaj seçildi
            </span>
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleBulkAction("mark_read")}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                Okundu Olarak İşaretle
              </motion.button>
              <motion.button
                onClick={() => handleBulkAction("mark_replied")}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Reply className="w-4 h-4" />
                Yanıtlandı Olarak İşaretle
              </motion.button>
              <motion.button
                onClick={() => handleBulkAction("delete")}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
                Sil
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Messages Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedMessages.length === filteredMessages.length &&
                      filteredMessages.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kişi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Proje Türü
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mesaj
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredMessages.map((message) => (
                <motion.tr
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMessages.includes(message.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMessages((prev) => [...prev, message.id]);
                        } else {
                          setSelectedMessages((prev) =>
                            prev.filter((id) => id !== message.id)
                          );
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {message.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="text-xs text-slate-500 dark:text-slate-500">
                            {message.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {message.project_type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-slate-900 dark:text-white line-clamp-2">
                        {message.message}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        message.status
                      )}`}
                    >
                      {getStatusIcon(message.status)}
                      {getStatusText(message.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(message.created_at).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowMessageModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Mesajı Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <select
                        value={message.status}
                        onChange={(e) =>
                          handleStatusChange(message.id, e.target.value)
                        }
                        className="text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="new">Yeni</option>
                        <option value="read">Okundu</option>
                        <option value="replied">Yanıtlandı</option>
                        <option value="closed">Kapandı</option>
                      </select>
                      <motion.button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Mesajı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || statusFilter !== "all"
                ? "Arama kriterlerinize uygun mesaj bulunamadı."
                : "Henüz mesaj bulunmuyor."}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowMessageModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                Mesaj Detayları
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    İsim
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedMessage.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    E-posta
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedMessage.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Telefon
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedMessage.phone || "Belirtilmemiş"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Proje Türü
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedMessage.project_type}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Mesaj
                </label>
                <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-slate-900 dark:text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-slate-600 dark:text-slate-400">
                    Tarih
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(selectedMessage.created_at).toLocaleString(
                      "tr-TR"
                    )}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-slate-600 dark:text-slate-400">
                    Kaynak
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {selectedMessage.source}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  onClick={() => {
                    handleStatusChange(selectedMessage.id, "read");
                    setShowMessageModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  Okundu Olarak İşaretle
                </motion.button>
                <motion.button
                  onClick={() => {
                    handleStatusChange(selectedMessage.id, "replied");
                    setShowMessageModal(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Reply className="w-4 h-4" />
                  Yanıtlandı Olarak İşaretle
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ContactMessages;
