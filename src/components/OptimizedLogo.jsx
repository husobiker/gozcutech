import React from "react";

/**
 * Optimized Logo Component
 * WebP desteği ile modern format kullanır, fallback olarak PNG
 */
const OptimizedLogo = ({ 
  className = "", 
  width = "216", 
  height = "84",
  loading = "eager",
  priority = false 
}) => {
  return (
    <picture>
      {/* Modern format - WebP */}
      <source 
        srcSet="/logo.webp" 
        type="image/webp" 
      />
      {/* Fallback - PNG */}
      <img
        src="/logo.png"
        alt="Gözcu Yazılım Logo"
        className={className}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
};

export default OptimizedLogo;

