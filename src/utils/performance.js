// Performance utilities for the Gozcu Corporate Site

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
      img.classList.add("loaded");
    });
  }
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = () => {
  const criticalResources = ["/logo.png", "/src/images/linux.png"];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = resource;
    document.head.appendChild(link);
  });
};

/**
 * Optimize scroll performance
 */
export const optimizeScrollPerformance = () => {
  let ticking = false;

  const updateScrollElements = () => {
    // Update scroll-dependent elements here
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollElements);
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
};

/**
 * Initialize all performance optimizations
 */
export const initPerformanceOptimizations = () => {
  preloadCriticalResources();
  lazyLoadImages();
  optimizeScrollPerformance();
};

/**
 * Track page performance metrics
 */
export const trackPerformanceMetrics = () => {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        const metrics = {
          domContentLoaded:
            perfData.domContentLoadedEventEnd -
            perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint:
            performance
              .getEntriesByType("paint")
              .find((entry) => entry.name === "first-paint")?.startTime || 0,
          firstContentfulPaint:
            performance
              .getEntriesByType("paint")
              .find((entry) => entry.name === "first-contentful-paint")
              ?.startTime || 0,
        };

        // Send to analytics if available
        if (typeof gtag !== "undefined") {
          gtag("event", "page_performance", {
            event_category: "Performance",
            event_label: "Page Load Metrics",
            value: Math.round(metrics.loadComplete),
          });
        }

        console.log("Performance Metrics:", metrics);
      }, 0);
    });
  }
};
