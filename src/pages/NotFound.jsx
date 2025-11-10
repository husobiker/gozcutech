import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-6">
      <Helmet>
        <title>Sayfa Bulunamadı - 404 | Gözcü Yazılım Teknoloji</title>
        <meta name="description" content="Aradığınız sayfa mevcut değil. Ana sayfaya dönerek istediğiniz içeriği bulabilirsiniz." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://gozcu.tech/404" />
      </Helmet>
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
            404
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6"
          >
            <RefreshCw className="w-full h-full text-slate-400" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Sayfa Bulunamadı
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
            Ana sayfaya dönerek istediğiniz içeriği bulabilirsiniz.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <motion.button
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="size-4" />
              Ana Sayfaya Dön
            </motion.button>
          </Link>
          
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="size-4" />
            Geri Git
          </motion.button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-slate-200"
        >
          <p className="text-sm text-slate-500 mb-4">Popüler sayfalar:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/#about"
              className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              to="/#solutions"
              className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Hizmetlerimiz
            </Link>
            <Link
              to="/#plans"
              className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Planlar
            </Link>
            <Link
              to="/blog"
              className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/#contact"
              className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              İletişim
            </Link>
          </div>
        </motion.div>

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
            width="216"
            height="84"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
