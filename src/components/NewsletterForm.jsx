import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, X } from "lucide-react";
import ValidationUtils from "../utils/validation.js";

const NewsletterForm = ({ 
  title = "Blog Güncellemelerini Kaçırma", 
  description = "Yeni yazılarımızdan haberdar olmak için e-posta listemize katılın.",
  buttonText = "Abone Ol",
  className = "",
  onSubscribe = null 
}) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting kontrolü
    const rateLimitCheck = ValidationUtils.checkRateLimit('newsletter', 2, 300000); // 5 dakika
    if (!rateLimitCheck.allowed) {
      setError(`Çok fazla deneme yaptınız. ${rateLimitCheck.remainingTime} saniye sonra tekrar deneyin.`);
      return;
    }

    // Email validasyonu
    const validation = ValidationUtils.validateNewsletterEmail(email);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Newsletter aboneliği için API çağrısı
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: ValidationUtils.sanitizeInput(email),
          source: 'website',
          ip_address: '', // Backend'de eklenebilir
          user_agent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setIsSubscribed(true);
        setEmail("");
        
        // Analytics event
        if (window.gtag) {
          window.gtag('event', 'newsletter_subscribe', {
            event_category: 'Newsletter',
            event_label: 'Newsletter Subscription'
          });
        }

        // Custom callback
        if (onSubscribe) {
          onSubscribe(email);
        }

        // 5 saniye sonra success mesajını gizle
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.message || "Abonelik işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      
      // Fallback: localStorage'a kaydet (offline için)
      try {
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
          
          setSubmitSuccess(true);
          setIsSubscribed(true);
          setEmail("");
          
          // Analytics event
          if (window.gtag) {
            window.gtag('event', 'newsletter_subscribe_offline', {
              event_category: 'Newsletter',
              event_label: 'Offline Newsletter Subscription'
            });
          }
        } else {
          setError("Bu e-posta adresi zaten abone!");
        }
      } catch (storageError) {
        setError("Abonelik işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl ${className}`}
      >
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Başarıyla Abone Oldunuz!
        </h3>
        <p className="text-green-700 dark:text-green-300 text-sm">
          E-posta adresinize gönderilen onay linkine tıklayarak aboneliğinizi aktifleştirin.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`text-center ${className}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        {description}
      </p>

      {/* Success Message */}
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-xl"
        >
          <p className="text-green-800 dark:text-green-200 text-sm font-medium">
            ✅ Başarıyla abone oldunuz! E-posta adresinize onay linki gönderildi.
          </p>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-xl"
        >
          <p className="text-red-800 dark:text-red-200 text-sm font-medium">
            ❌ {error}
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="E-posta adresiniz"
            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-colors ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500'
            } bg-white dark:bg-slate-700 text-slate-900 dark:text-white`}
            required
            disabled={isSubmitting}
            aria-describedby={error ? "email-error" : undefined}
          />
        </div>
        <motion.button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
            isSubmitting || !email.trim()
              ? 'bg-slate-400 dark:bg-slate-600 text-white cursor-not-allowed'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 dark:hover:bg-slate-100'
          }`}
          whileHover={!isSubmitting && email.trim() ? { scale: 1.05 } : {}}
          whileTap={!isSubmitting && email.trim() ? { scale: 0.95 } : {}}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Gönderiliyor...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </motion.button>
      </form>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
        KVKK uyumlu. İstediğiniz zaman abonelikten çıkabilirsiniz.
      </p>
    </motion.div>
  );
};

export default NewsletterForm;




