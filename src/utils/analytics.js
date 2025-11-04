import React from "react";

// Google Analytics utilities
export const AnalyticsUtils = {
  // Initialize Google Analytics
  initGA: (measurementId) => {
    if (typeof window === "undefined" || !measurementId) return;

    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });
  },

  // Track page views
  trackPageView: (path, title) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title,
      });
    }
  },

  // Track custom events
  trackEvent: (eventName, parameters = {}) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, parameters);
    }
  },

  // Track form submissions
  trackFormSubmission: (formName, success = true) => {
    AnalyticsUtils.trackEvent("form_submission", {
      form_name: formName,
      success: success,
    });
  },

  // Track button clicks
  trackButtonClick: (buttonName, location) => {
    AnalyticsUtils.trackEvent("button_click", {
      button_name: buttonName,
      location: location,
    });
  },

  // Track file downloads
  trackDownload: (fileName, fileType) => {
    AnalyticsUtils.trackEvent("file_download", {
      file_name: fileName,
      file_type: fileType,
    });
  },

  // Track external link clicks
  trackExternalLink: (url, linkText) => {
    AnalyticsUtils.trackEvent("external_link_click", {
      link_url: url,
      link_text: linkText,
    });
  },

  // Track scroll depth
  trackScrollDepth: (depth) => {
    AnalyticsUtils.trackEvent("scroll_depth", {
      depth: depth,
    });
  },

  // Track time on page
  trackTimeOnPage: (timeInSeconds) => {
    AnalyticsUtils.trackEvent("time_on_page", {
      time_in_seconds: timeInSeconds,
    });
  },
};

// Performance monitoring utilities
export const PerformanceUtils = {
  // Measure page load time
  measurePageLoad: () => {
    if (typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;

        AnalyticsUtils.trackEvent("page_load_time", {
          load_time: Math.round(loadTime),
          dom_content_loaded: Math.round(domContentLoaded),
        });
      }
    });
  },

  // Measure Core Web Vitals
  measureCoreWebVitals: () => {
    if (typeof window === "undefined") return;

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      AnalyticsUtils.trackEvent("lcp", {
        value: Math.round(lastEntry.startTime),
      });
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        AnalyticsUtils.trackEvent("fid", {
          value: Math.round(entry.processingStart - entry.startTime),
        });
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      AnalyticsUtils.trackEvent("cls", {
        value: Math.round(clsValue * 1000) / 1000,
      });
    }).observe({ entryTypes: ["layout-shift"] });
  },

  // Measure resource loading times
  measureResourceTiming: () => {
    if (typeof window === "undefined") return;

    window.addEventListener("load", () => {
      const resources = performance.getEntriesByType("resource");
      resources.forEach((resource) => {
        const loadTime = resource.responseEnd - resource.requestStart;
        AnalyticsUtils.trackEvent("resource_load_time", {
          resource_name: resource.name,
          load_time: Math.round(loadTime),
          resource_type: resource.initiatorType,
        });
      });
    });
  },

  // Measure user interactions
  measureUserInteractions: () => {
    if (typeof window === "undefined") return;

    // Track click events
    document.addEventListener("click", (event) => {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;

      AnalyticsUtils.trackEvent("user_interaction", {
        interaction_type: "click",
        element_tag: tagName,
        element_class: className,
        element_id: id,
      });
    });

    // Track scroll events
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
            100
        );
        AnalyticsUtils.trackScrollDepth(scrollDepth);
      }, 150);
    });
  },

  // Measure form performance
  measureFormPerformance: (formElement) => {
    if (!formElement) return;

    const startTime = performance.now();

    formElement.addEventListener("submit", () => {
      const endTime = performance.now();
      const formTime = Math.round(endTime - startTime);

      AnalyticsUtils.trackEvent("form_performance", {
        form_time: formTime,
        form_id: formElement.id,
      });
    });
  },

  // Initialize all performance monitoring
  init: () => {
    PerformanceUtils.measurePageLoad();
    PerformanceUtils.measureCoreWebVitals();
    PerformanceUtils.measureResourceTiming();
    PerformanceUtils.measureUserInteractions();
  },
};

// React hook for analytics
export const useAnalytics = () => {
  const trackEvent = React.useCallback((eventName, parameters) => {
    AnalyticsUtils.trackEvent(eventName, parameters);
  }, []);

  const trackPageView = React.useCallback((path, title) => {
    AnalyticsUtils.trackPageView(path, title);
  }, []);

  const trackFormSubmission = React.useCallback((formName, success) => {
    AnalyticsUtils.trackFormSubmission(formName, success);
  }, []);

  const trackButtonClick = React.useCallback((buttonName, location) => {
    AnalyticsUtils.trackButtonClick(buttonName, location);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackFormSubmission,
    trackButtonClick,
  };
};

// Analytics Provider Component
export const AnalyticsProvider = ({ children, measurementId }) => {
  React.useEffect(() => {
    if (measurementId) {
      AnalyticsUtils.initGA(measurementId);
      PerformanceUtils.init();
    }
  }, [measurementId]);

  return React.createElement(React.Fragment, null, children);
};

// Performance monitoring component
export const PerformanceMonitor = ({ children }) => {
  React.useEffect(() => {
    PerformanceUtils.init();
  }, []);

  return React.createElement(React.Fragment, null, children);
};

export default AnalyticsUtils;
