import React from "react";

// Mobile optimization utilities
export const MobileUtils = {
  // Check if device is mobile
  isMobile: () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  },

  // Check if device is tablet
  isTablet: () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  // Check if device is desktop
  isDesktop: () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  },

  // Get viewport dimensions
  getViewportDimensions: () => {
    if (typeof window === "undefined") return { width: 0, height: 0 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  // Touch detection
  isTouchDevice: () => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  },

  // Mobile-specific optimizations
  optimizeForMobile: (element) => {
    if (MobileUtils.isMobile()) {
      // Add mobile-specific classes
      element.classList.add("mobile-optimized");

      // Optimize images for mobile
      const images = element.querySelectorAll("img");
      images.forEach((img) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute("decoding", "async");
      });

      // Optimize animations for mobile
      const animatedElements = element.querySelectorAll("[data-animate]");
      animatedElements.forEach((el) => {
        el.setAttribute("data-reduce-motion", "true");
      });
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },

  // Get current breakpoint
  getCurrentBreakpoint: () => {
    const width = MobileUtils.getViewportDimensions().width;
    const breakpoints = MobileUtils.breakpoints;

    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return "xs";
  },
};

// Mobile-optimized Image Component
export const MobileImage = ({
  src,
  alt,
  className = "",
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${MobileUtils.isMobile() ? "w-full h-auto" : ""}`}
        {...props}
      />

      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
      )}

      {isError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Görsel yüklenemedi</span>
        </div>
      )}
    </div>
  );
};

// Mobile-optimized Button Component
export const MobileButton = ({
  children,
  className = "",
  size = "md",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[44px]", // Minimum touch target
    md: "px-4 py-3 text-base min-h-[48px]",
    lg: "px-6 py-4 text-lg min-h-[52px]",
  };

  const mobileClasses = MobileUtils.isMobile()
    ? "touch-manipulation select-none"
    : "";

  return (
    <button
      className={`${sizeClasses[size]} ${mobileClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Mobile-optimized Container Component
export const MobileContainer = ({
  children,
  className = "",
  padding = true,
}) => {
  const paddingClasses = padding ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div className={`max-w-7xl mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

// Mobile-optimized Grid Component
export const MobileGrid = ({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = "gap-4",
  className = "",
}) => {
  const gridClasses = Object.entries(cols)
    .map(([breakpoint, colCount]) => {
      if (breakpoint === "default") {
        return `grid-cols-${colCount}`;
      }
      return `${breakpoint}:grid-cols-${colCount}`;
    })
    .join(" ");

  return (
    <div className={`grid ${gridClasses} ${gap} ${className}`}>{children}</div>
  );
};

// Mobile-optimized Text Component
export const MobileText = ({
  children,
  size = "base",
  className = "",
  ...props
}) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  const mobileSizeClasses = MobileUtils.isMobile() ? "leading-relaxed" : "";

  return (
    <p
      className={`${sizeClasses[size]} ${mobileSizeClasses} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Mobile-optimized Card Component
export const MobileCard = ({
  children,
  className = "",
  padding = true,
  ...props
}) => {
  const paddingClasses = padding ? "p-4 sm:p-6" : "";

  const mobileClasses = MobileUtils.isMobile() ? "rounded-lg" : "rounded-xl";

  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm ${mobileClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Mobile-optimized Form Component
export const MobileForm = ({ children, className = "", ...props }) => {
  const mobileClasses = MobileUtils.isMobile() ? "space-y-4" : "space-y-6";

  return (
    <form className={`${mobileClasses} ${className}`} {...props}>
      {children}
    </form>
  );
};

// Mobile-optimized Input Component
export const MobileInput = ({ className = "", ...props }) => {
  const mobileClasses = MobileUtils.isMobile()
    ? "text-base min-h-[48px]" // Prevent zoom on iOS
    : "";

  return (
    <input
      className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${mobileClasses} ${className}`}
      {...props}
    />
  );
};

// Mobile-optimized Textarea Component
export const MobileTextarea = ({ className = "", ...props }) => {
  const mobileClasses = MobileUtils.isMobile()
    ? "text-base min-h-[48px]" // Prevent zoom on iOS
    : "";

  return (
    <textarea
      className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${mobileClasses} ${className}`}
      {...props}
    />
  );
};

// Mobile-optimized Navigation Component
export const MobileNav = ({ children, className = "", ...props }) => {
  const mobileClasses = MobileUtils.isMobile()
    ? "flex-col space-y-2"
    : "flex-row space-x-6";

  return (
    <nav className={`flex ${mobileClasses} ${className}`} {...props}>
      {children}
    </nav>
  );
};

// Mobile-optimized Modal Component
export const MobileModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  ...props
}) => {
  const mobileClasses = MobileUtils.isMobile()
    ? "mx-4 my-8 max-h-[90vh] overflow-y-auto"
    : "mx-auto my-16 max-w-lg";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        <div
          className={`inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle ${mobileClasses} ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileUtils;




