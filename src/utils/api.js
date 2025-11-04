// API endpoints and utilities for the Gozcu Corporate Site CMS

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// API Response Types
export const API_RESPONSE = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("admin_token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("API call failed:", error);
    return { success: false, error: error.message };
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiCall("/auth/logout", {
      method: "POST",
    });
  },

  refreshToken: async () => {
    return apiCall("/auth/refresh", {
      method: "POST",
    });
  },

  verifyToken: async () => {
    return apiCall("/auth/verify");
  },
};

// Blog API
export const blogAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/blog${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiCall(`/blog/${id}`);
  },

  create: async (blogData) => {
    return apiCall("/blog", {
      method: "POST",
      body: JSON.stringify(blogData),
    });
  },

  update: async (id, blogData) => {
    return apiCall(`/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(blogData),
    });
  },

  delete: async (id) => {
    return apiCall(`/blog/${id}`, {
      method: "DELETE",
    });
  },

  publish: async (id) => {
    return apiCall(`/blog/${id}/publish`, {
      method: "PATCH",
    });
  },

  unpublish: async (id) => {
    return apiCall(`/blog/${id}/unpublish`, {
      method: "PATCH",
    });
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/projects${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiCall(`/projects/${id}`);
  },

  create: async (projectData) => {
    return apiCall("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  update: async (id, projectData) => {
    return apiCall(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id) => {
    return apiCall(`/projects/${id}`, {
      method: "DELETE",
    });
  },

  toggleFeatured: async (id) => {
    return apiCall(`/projects/${id}/toggle-featured`, {
      method: "PATCH",
    });
  },
};

// Users API
export const usersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/users${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return apiCall(`/users/${id}`);
  },

  create: async (userData) => {
    return apiCall("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return apiCall(`/users/${id}`, {
      method: "DELETE",
    });
  },

  toggleStatus: async (id) => {
    return apiCall(`/users/${id}/toggle-status`, {
      method: "PATCH",
    });
  },

  updatePermissions: async (id, permissions) => {
    return apiCall(`/users/${id}/permissions`, {
      method: "PATCH",
      body: JSON.stringify({ permissions }),
    });
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    return apiCall("/settings");
  },

  update: async (settingsData) => {
    return apiCall("/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    });
  },

  updateSection: async (section, data) => {
    return apiCall(`/settings/${section}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getStats: async (period = "30d") => {
    return apiCall(`/analytics/stats?period=${period}`);
  },

  getVisitors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(
      `/analytics/visitors${queryString ? `?${queryString}` : ""}`
    );
  },

  getPopularContent: async (type = "blog", limit = 10) => {
    return apiCall(`/analytics/popular?type=${type}&limit=${limit}`);
  },
};

// File Upload API
export const fileAPI = {
  upload: async (file, type = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return apiCall("/files/upload", {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    });
  },

  delete: async (fileId) => {
    return apiCall(`/files/${fileId}`, {
      method: "DELETE",
    });
  },

  getList: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/files${queryString ? `?${queryString}` : ""}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiCall("/dashboard/stats");
  },

  getRecentActivity: async (limit = 10) => {
    return apiCall(`/dashboard/activity?limit=${limit}`);
  },

  getQuickStats: async () => {
    return apiCall("/dashboard/quick-stats");
  },
};

// Plans API
export const plansAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/plans${queryString ? `?${queryString}` : ""}`);
  },
  getById: async (id) => apiCall(`/plans/${id}`),
  create: async (data) =>
    apiCall("/plans", { method: "POST", body: JSON.stringify(data) }),
  update: async (id, data) =>
    apiCall(`/plans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: async (id) => apiCall(`/plans/${id}`, { method: "DELETE" }),
};

// Error handling utility
export const handleAPIError = (error, defaultMessage = "Bir hata oluştu") => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    return "Sunucuya bağlanılamadı";
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

// Request interceptor for adding auth token
export const setupAPIInterceptors = () => {
  // This would be used with axios if you switch to axios
  // For now, it's handled in the apiCall function
};

// API status checker
export const checkAPIStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Export all APIs as a single object for easier imports
export const API = {
  auth: authAPI,
  blog: blogAPI,
  projects: projectsAPI,
  users: usersAPI,
  settings: settingsAPI,
  analytics: analyticsAPI,
  files: fileAPI,
  dashboard: dashboardAPI,
  plans: plansAPI,
};

export default API;
