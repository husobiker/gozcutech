// SEO Utilities for Gözcu Yazılım
export const SEOUtils = {
  // Generate page title
  generateTitle: (pageTitle, siteName = "Gözcu Yazılım") => {
    if (!pageTitle) return siteName;
    if (pageTitle.includes(siteName)) return pageTitle;
    return `${pageTitle} | ${siteName}`;
  },

  // Generate meta description
  generateDescription: (content, maxLength = 160) => {
    if (!content)
      return "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri.";

    // Remove HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, "");

    // Truncate to max length
    if (cleanContent.length <= maxLength) return cleanContent;

    // Find last complete word
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  },

  // Generate keywords from content
  generateKeywords: (content, tags = []) => {
    const baseKeywords = [
      "web tasarım",
      "web programlama",
      "ERP yazılımı",
      "bulut sunucu",
      "VIP sunucu",
      "özel yazılım",
      "teknoloji AR-GE",
      "İstanbul",
      "Gözcu Yazılım",
    ];

    // Extract keywords from content
    const contentKeywords = [];
    if (content) {
      const words = content
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 3)
        .filter(
          (word) =>
            ![
              "bir",
              "bu",
              "ve",
              "ile",
              "için",
              "olan",
              "gibi",
              "daha",
              "çok",
              "en",
              "da",
              "de",
            ].includes(word)
        );

      // Count word frequency
      const wordCount = {};
      words.forEach((word) => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });

      // Get most frequent words
      const frequentWords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);

      contentKeywords.push(...frequentWords);
    }

    // Combine all keywords
    const allKeywords = [...baseKeywords, ...(tags || []), ...contentKeywords];

    // Remove duplicates and limit
    return [...new Set(allKeywords)].slice(0, 20).join(", ");
  },

  // Generate canonical URL
  generateCanonicalUrl: (path, baseUrl = "https://gozcu.tech") => {
    if (!path) return baseUrl;
    if (path.startsWith("http")) return path;
    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  },

  // Generate Open Graph image
  generateOGImage: (title, baseUrl = "https://gozcu.tech") => {
    // For now, return the default logo
    // In the future, this could generate dynamic OG images
    return `${baseUrl}/logo.png`;
  },

  // Generate JSON-LD structured data
  generateStructuredData: (type, data) => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      name: "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
      url: "https://gozcu.tech",
      logo: "https://gozcu.tech/logo.png",
      description: "Modern, güvenilir ve ölçeklenebilir yazılım çözümleri.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "İstanbul",
        addressCountry: "TR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+90-555-111-22-33",
        contactType: "customer service",
        email: "info@gozcu.tech",
      },
      sameAs: [
        "https://github.com/gozcu",
        "https://linkedin.com/company/gozcu",
      ],
    };

    switch (type) {
      case "Article":
        return {
          ...baseData,
          "@type": "Article",
          headline: data.title,
          description: data.description,
          image: data.image || baseData.logo,
          author: {
            "@type": "Organization",
            name: data.author || "Gözcu Yazılım",
          },
          publisher: {
            "@type": "Organization",
            name: "Gözcu Yazılım",
            logo: {
              "@type": "ImageObject",
              url: baseData.logo,
            },
          },
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime || data.publishedTime,
          articleSection: data.section,
          keywords: data.tags?.join(", "),
        };

      case "WebPage":
        return {
          ...baseData,
          "@type": "WebPage",
          name: data.title,
          description: data.description,
          url: data.url,
          isPartOf: {
            "@type": "WebSite",
            name: "Gözcu Yazılım",
            url: "https://gozcu.tech",
          },
        };

      case "Service":
        return {
          ...baseData,
          "@type": "Service",
          name: data.name,
          description: data.description,
          provider: {
            "@type": "Organization",
            name: "Gözcu Yazılım",
          },
          serviceType: data.serviceType,
          areaServed: {
            "@type": "Country",
            name: "Turkey",
          },
        };

      default:
        return baseData;
    }
  },

  // Generate breadcrumb structured data
  generateBreadcrumbData: (items) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  },

  // Generate FAQ structured data
  generateFAQData: (faqs) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  },

  // Generate local business structured data
  generateLocalBusinessData: () => {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
      description:
        "Web tasarım, ERP yazılımları, VIP bulut sunucu ve özel yazılım geliştirme hizmetleri",
      url: "https://gozcu.tech",
      telephone: "+90-555-111-22-33",
      email: "info@gozcu.tech",
      address: {
        "@type": "PostalAddress",
        addressLocality: "İstanbul",
        addressCountry: "TR",
      },
      openingHours: "Mo-Fr 09:00-18:00",
      priceRange: "$$",
      serviceArea: {
        "@type": "Country",
        name: "Turkey",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Yazılım Hizmetleri",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Web Tasarım",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "ERP Yazılımları",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "VIP Bulut Sunucu",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Özel Yazılım Geliştirme",
            },
          },
        ],
      },
    };
  },

  // Clean URL for SEO
  cleanUrl: (url) => {
    return url
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  },

  // Generate sitemap entry
  generateSitemapEntry: (
    url,
    lastmod,
    changefreq = "weekly",
    priority = "0.8"
  ) => {
    return {
      url,
      lastmod: lastmod || new Date().toISOString().split("T")[0],
      changefreq,
      priority,
    };
  },
};

export default SEOUtils;
