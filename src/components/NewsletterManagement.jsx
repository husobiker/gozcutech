import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Users, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Send,
  UserPlus,
  UserMinus
} from "lucide-react";

const NewsletterManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      
      // Load from localStorage (simulated data)
      const savedSubscribers = localStorage.getItem("newsletter_subscribers");
      let subscribersData = [];

      if (savedSubscribers) {
        subscribersData = JSON.parse(savedSubscribers).map((email, index) => ({
          id: index + 1,
          email: email,
          status: 'confirmed',
          subscribed_at: new Date().toISOString(),
          source: 'website'
        }));
      } else {
        // Sample data
        subscribersData = [
          {
            id: 1,
            email: "test@example.com",
            status: "confirmed",
            subscribed_at: "2024-12-15T10:30:00Z",
            source: "website"
          },
          {
            id: 2,
            email: "demo@company.com",
            status: "pending",
            subscribed_at: "2024-12-14T15:45:00Z",
            source: "blog"
          },
          {
            id: 3,
            email: "user@domain.com",
            status: "confirmed",
            subscribed_at: "2024-12-13T09:20:00Z",
            source: "website"
          }
        ];
      }

      setSubscribers(subscribersData);
    } catch (error) {
      console.error("Error loading subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || subscriber.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setSubscribers(prev => 
      prev.map(sub => 
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );
  };

  const handleDeleteSubscriber = (id) => {
    if (window.confirm("Bu aboneyi silmek istediğinizden emin misiniz?")) {
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedSubscribers.length === 0) return;

    switch (action) {
      case 'delete':
        if (window.confirm(`${selectedSubscribers.length} aboneyi silmek istediğinizden emin misiniz?`)) {
          setSubscribers(prev => 
            prev.filter(sub => !selectedSubscribers.includes(sub.id))
          );
          setSelectedSubscribers([]);
        }
        break;
      case 'confirm':
        setSubscribers(prev => 
          prev.map(sub => 
            selectedSubscribers.includes(sub.id) 
              ? { ...sub, status: 'confirmed' }
              : sub
          )
        );
        setSelectedSubscribers([]);
        break;
      case 'unsubscribe':
        setSubscribers(prev => 
          prev.map(sub => 
            selectedSubscribers.includes(sub.id) 
              ? { ...sub, status: 'unsubscribed' }
              : sub
          )
        );
        setSelectedSubscribers([]);
        break;
    }
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At', 'Source'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.subscribed_at).toLocaleDateString('tr-TR'),
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'unsubscribed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Onaylandı';
      case 'pending': return 'Beklemede';
      case 'unsubscribed': return 'Abonelikten Çıktı';
      default: return 'Bilinmiyor';
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
            Newsletter Yönetimi
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {subscribers.length} toplam abone
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={exportSubscribers}
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
              placeholder="E-posta ile ara..."
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
          <option value="confirmed">Onaylandı</option>
          <option value="pending">Beklemede</option>
          <option value="unsubscribed">Abonelikten Çıktı</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 dark:text-blue-200 font-medium">
              {selectedSubscribers.length} abone seçildi
            </span>
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleBulkAction('confirm')}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle className="w-4 h-4" />
                Onayla
              </motion.button>
              <motion.button
                onClick={() => handleBulkAction('unsubscribe')}
                className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserMinus className="w-4 h-4" />
                Abonelikten Çıkar
              </motion.button>
              <motion.button
                onClick={() => handleBulkAction('delete')}
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

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kaynak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Abone Olma Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredSubscribers.map((subscriber) => (
                <motion.tr
                  key={subscriber.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers(prev => [...prev, subscriber.id]);
                        } else {
                          setSelectedSubscribers(prev => prev.filter(id => id !== subscriber.id));
                        }
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(subscriber.status)}`}>
                      {getStatusText(subscriber.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {subscriber.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(subscriber.subscribed_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={subscriber.status}
                        onChange={(e) => handleStatusChange(subscriber.id, e.target.value)}
                        className="text-xs border border-slate-300 dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="pending">Beklemede</option>
                        <option value="confirmed">Onaylandı</option>
                        <option value="unsubscribed">Abonelikten Çıktı</option>
                      </select>
                      <motion.button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
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
        
        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || statusFilter !== "all" 
                ? "Arama kriterlerinize uygun abone bulunamadı." 
                : "Henüz abone bulunmuyor."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterManagement;




