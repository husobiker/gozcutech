import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import GozcuCorporateSiteLight from "./components/GozcuCorporateSiteLight.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import {
  initPerformanceOptimizations,
  trackPerformanceMetrics,
} from "./utils/performance.js";
import { AnalyticsProvider, PerformanceMonitor } from "./utils/analytics.js";

function App() {
  useEffect(() => {
    // Initialize performance optimizations
    initPerformanceOptimizations();
    trackPerformanceMetrics();
  }, []);

  return (
    <HelmetProvider>
      <AnalyticsProvider measurementId={import.meta.env.VITE_GA_MEASUREMENT_ID}>
        <PerformanceMonitor>
          <ErrorBoundary>
            <Router>
              <Routes>
                <Route path="/" element={<GozcuCorporateSiteLight />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </ErrorBoundary>
        </PerformanceMonitor>
      </AnalyticsProvider>
    </HelmetProvider>
  );
}

export default App;
