import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy, 
  Check,
  MessageCircle,
  Link as LinkIcon
} from "lucide-react";

const SocialShare = ({ 
  url, 
  title, 
  description, 
  hashtags = [],
  className = "",
  showLabel = true,
  variant = "default" // default, compact, minimal
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const shareData = {
    url: url || window.location.href,
    title: title || document.title,
    description: description || "",
    hashtags: hashtags.join(",")
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);
    const encodedDescription = encodeURIComponent(shareData.description);
    const encodedHashtags = encodeURIComponent(shareData.hashtags);

    let shareUrl = "";

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'mail':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        
        // Analytics event
        if (window.gtag) {
          window.gtag('event', 'share', {
            method: 'copy',
            content_type: 'url',
            item_id: shareData.url
          });
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      
      // Analytics event
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: platform,
          content_type: 'url',
          item_id: shareData.url
        });
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url
        });
        
        // Analytics event
        if (window.gtag) {
          window.gtag('event', 'share', {
            method: 'native',
            content_type: 'url',
            item_id: shareData.url
          });
        }
      } catch (error) {
        console.log('Native share cancelled or failed');
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareButtons = [
    {
      platform: 'facebook',
      icon: Facebook,
      label: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      platform: 'twitter',
      icon: Twitter,
      label: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    {
      platform: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'bg-blue-700 hover:bg-blue-800',
      textColor: 'text-white'
    },
    {
      platform: 'whatsapp',
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      platform: 'mail',
      icon: Mail,
      label: 'E-posta',
      color: 'bg-slate-600 hover:bg-slate-700',
      textColor: 'text-white'
    },
    {
      platform: 'copy',
      icon: copied ? Check : Copy,
      label: copied ? 'Kopyalandı!' : 'Kopyala',
      color: copied ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-500 hover:bg-slate-600',
      textColor: 'text-white'
    }
  ];

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-slate-600 dark:text-slate-400">Paylaş:</span>
        )}
        <div className="flex gap-1">
          {shareButtons.slice(0, 3).map((button) => (
            <motion.button
              key={button.platform}
              onClick={() => handleShare(button.platform)}
              className={`p-2 rounded-lg ${button.color} ${button.textColor} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showLabel && (
          <span className="text-sm text-slate-600 dark:text-slate-400">Paylaş:</span>
        )}
        <div className="flex gap-1">
          {shareButtons.map((button) => (
            <motion.button
              key={button.platform}
              onClick={() => handleShare(button.platform)}
              className={`p-2 rounded-lg ${button.color} ${button.textColor} transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`relative ${className}`}>
      {/* Native Share Button (Mobile) */}
      {navigator.share && (
        <motion.button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Share2 className="w-4 h-4" />
          Paylaş
        </motion.button>
      )}

      {/* Desktop Share Menu */}
      {!navigator.share && (
        <>
          <motion.button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            {showLabel && <span>Paylaş</span>}
          </motion.button>

          {/* Share Menu Dropdown */}
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-2 z-50 min-w-48"
            >
              <div className="grid grid-cols-2 gap-2">
                {shareButtons.map((button) => (
                  <motion.button
                    key={button.platform}
                    onClick={() => {
                      handleShare(button.platform);
                      setShowShareMenu(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${button.color} ${button.textColor} transition-colors text-sm`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button.icon className="w-4 h-4" />
                    <span>{button.label}</span>
                  </motion.button>
                ))}
              </div>
              
              {/* URL Copy */}
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {shareData.url}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Click outside to close */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default SocialShare;




