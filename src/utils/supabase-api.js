// Supabase API - Gözcu Yazılım Corporate Site
import {
  supabase,
  supabaseAdmin,
  TABLES,
  supabaseHelpers,
} from "../lib/supabase.js";

// API Response Types
export const API_RESPONSE = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
};

// Blog API
export const blogAPI = {
  getAll: async (params = {}) => {
    try {
      const {
        status = "published",
        limit = 10,
        offset = 0,
        featured = false,
      } = params;

      let query = supabase
        .from(TABLES.BLOG_POSTS)
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      // Status filtresi - null ise tüm statusları getir
      if (status !== null) {
        query = query.eq("status", status);
      }

      if (featured) {
        query = query.eq("featured", true);
      }

      const { data, error } = await query;

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BLOG_POSTS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  getBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.BLOG_POSTS)
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  create: async (blogData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.BLOG_POSTS)
        .insert([blogData])
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  update: async (id, blogData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.BLOG_POSTS)
        .update({ ...blogData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.BLOG_POSTS)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({ id });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  publish: async (id) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.BLOG_POSTS)
        .update({ status: "published", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  unpublish: async (id) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.BLOG_POSTS)
        .update({ status: "draft", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  incrementViews: async (id) => {
    try {
      const { error } = await supabase
        .from(TABLES.BLOG_POSTS)
        .update({ views: supabase.raw("views + 1") })
        .eq("id", id);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({});
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params = {}) => {
    try {
      const {
        featured = false,
        limit = 10,
        offset = 0,
        category = null,
      } = params;

      let query = supabase
        .from(TABLES.PROJECTS)
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (featured) {
        query = query.eq("featured", true);
      }

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  create: async (projectData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PROJECTS)
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  update: async (id, projectData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PROJECTS)
        .update({ ...projectData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.PROJECTS)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({ id });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  toggleFeatured: async (id) => {
    try {
      // Önce mevcut featured durumunu al
      const { data: current, error: fetchError } = await supabaseAdmin
        .from(TABLES.PROJECTS)
        .select("featured")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Featured durumunu tersine çevir
      const { data, error } = await supabaseAdmin
        .from(TABLES.PROJECTS)
        .update({
          featured: !current.featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    try {
      const { data, error } = await supabase.from(TABLES.SETTINGS).select("*");

      if (error) throw error;

      // Settings'i key-value objesi olarak dönüştür
      const settings = {};
      data.forEach((item) => {
        settings[item.key] = item.value;
      });

      return supabaseHelpers.handleSuccess(settings);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  update: async (settingsData) => {
    try {
      const updates = Object.entries(settingsData).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { data, error } = await supabaseAdmin
        .from(TABLES.SETTINGS)
        .upsert(updates, { onConflict: "key" })
        .select();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  updateSection: async (section, data) => {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.SETTINGS)
        .update({
          value: data,
          updated_at: new Date().toISOString(),
        })
        .eq("key", section);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({});
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Plans API
export const plansAPI = {
  getAll: async (params = {}) => {
    try {
      const {
        plan_type = null,
        server_type = null,
        status = "active",
      } = params;

      let query = supabase
        .from(TABLES.PLANS)
        .select("*")
        .eq("status", status)
        .order("sort_order", { ascending: true });

      if (plan_type) {
        query = query.eq("plan_type", plan_type);
      }

      if (server_type) {
        query = query.eq("server_type", server_type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PLANS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  create: async (planData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLANS)
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  update: async (id, planData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.PLANS)
        .update({ ...planData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.PLANS)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({ id });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Contacts API
export const contactsAPI = {
  create: async (contactData) => {
    try {
      // Admin client kullanarak RLS'i bypass et
      const { data, error } = await supabaseAdmin
        .from(TABLES.CONTACTS)
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  getAll: async (params = {}) => {
    try {
      const { limit = 50, offset = 0, status = null } = params;

      let query = supabaseAdmin
        .from(TABLES.CONTACTS)
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  updateStatus: async (id, status) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.CONTACTS)
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Users API (Admin)
export const usersAPI = {
  getAll: async (params = {}) => {
    try {
      const { limit = 50, offset = 0 } = params;

      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .select("*")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  create: async (userData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  update: async (id, userData) => {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.USERS)
        .update({ ...userData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return supabaseHelpers.handleSuccess(data);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.USERS)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return supabaseHelpers.handleSuccess({ id });
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Analytics API
export const analyticsAPI = {
  getStats: async () => {
    try {
      // Blog sayısı
      const { count: blogCount } = await supabase
        .from(TABLES.BLOG_POSTS)
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

      // Proje sayısı
      const { count: projectCount } = await supabase
        .from(TABLES.PROJECTS)
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // İletişim sayısı
      const { count: contactCount } = await supabase
        .from(TABLES.CONTACTS)
        .select("*", { count: "exact", head: true });

      // Toplam görüntülenme
      const { data: viewsData } = await supabase
        .from(TABLES.BLOG_POSTS)
        .select("views")
        .eq("status", "published");

      const totalViews =
        viewsData?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;

      const stats = {
        totalBlogs: blogCount || 0,
        totalProjects: projectCount || 0,
        totalContacts: contactCount || 0,
        totalViews: totalViews,
      };

      return supabaseHelpers.handleSuccess(stats);
    } catch (error) {
      return supabaseHelpers.handleError(error);
    }
  },
};

// Error handling utility
export const handleAPIError = (error, defaultMessage = "Bir hata oluştu") => {
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

// Export all APIs as a single object for easier imports
export const API = {
  blog: blogAPI,
  projects: projectsAPI,
  settings: settingsAPI,
  plans: plansAPI,
  contacts: contactsAPI,
  users: usersAPI,
  analytics: analyticsAPI,
};

export default API;
