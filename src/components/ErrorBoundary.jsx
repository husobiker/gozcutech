import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Bir Hata Oluştu
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                Üzgünüz, beklenmeyen bir hata oluştu. Sayfayı yenilemeyi
                deneyebilir veya ana sayfaya dönebilirsiniz.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="size-4" />
                Tekrar Dene
              </motion.button>

              <motion.button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Home className="size-4" />
                Ana Sayfaya Dön
              </motion.button>
            </motion.div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 p-6 bg-slate-100 rounded-xl text-left"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Geliştirici Bilgileri:
                </h3>
                <details className="text-sm text-slate-600">
                  <summary className="cursor-pointer font-medium mb-2">
                    Hata Detayları
                  </summary>
                  <pre className="mt-2 p-4 bg-white rounded border overflow-auto text-xs">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </motion.div>
            )}

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12"
            >
              <img
                src="/logo.png"
                alt="Gözcu Yazılım Logo"
                className="h-12 w-auto mx-auto opacity-60"
              />
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
