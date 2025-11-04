import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Gözcü Yazılım Teknoloji | gozcu.tech",
  description = "Gözcü Yazılım Teknoloji - Modern, güvenilir ve ölçeklenebilir yazılım çözümleri. Web tasarım/programlama, VIP bulut sunucu kiralama, ERP yazılımları ve özel yazılım geliştirme hizmetleri. gozcu.tech",
  keywords = "Gözcü Yazılım Teknoloji, gözcü yazılım teknoloji, gozcu.tech, web tasarım, web programlama, ERP yazılımı, bulut sunucu, VIP sunucu, özel yazılım, teknoloji AR-GE, İstanbul",
  image = "https://gozcu.tech/logo.png",
  url = "https://gozcu.tech",
  type = "website",
  author = "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.",
  publishedTime = null,
  modifiedTime = null,
  section = null,
  tags = [],
  canonical = null,
  siteData = null,
  breadcrumbs = null
}) => {
  // Optimize title for brand search
  let fullTitle = title;
  if (!title.includes("Gözcü Yazılım Teknoloji") && !title.includes("gozcu.tech")) {
    fullTitle = `${title} | Gözcü Yazılım Teknoloji | gozcu.tech`;
  }
  const canonicalUrl = canonical || url;
  
  // Get contact info from siteData or use defaults
  const contactEmail = siteData?.email || "info@gozcu.tech";
  const contactPhone = siteData?.phone || "+90-555-111-22-33";
  const contactAddress = siteData?.address || "İstanbul, Türkiye";
  const githubUrl = siteData?.github || "https://github.com/gozcu";
  const linkedinUrl = siteData?.linkedin || "https://linkedin.com/company/gozcu";
  const siteName = siteData?.siteName || "Gözcu Yazılım Teknoloji AR-GE Ltd. Şti.";
  
  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Gözcü Yazılım Teknoloji",
    "alternateName": siteName,
    "legalName": "Gözcu Yazılım Teknoloji AR-GE Limited Şirketi",
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": image,
      "width": 512,
      "height": 512
    },
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": contactAddress.includes("İstanbul") ? "İstanbul" : contactAddress,
      "addressCountry": "TR",
      "addressRegion": contactAddress
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contactPhone.replace(/\s/g, "-"),
      "contactType": "customer service",
      "email": contactEmail,
      "availableLanguage": ["Turkish", "English"]
    },
    "sameAs": [
      githubUrl,
      linkedinUrl
    ],
    "foundingDate": "2019",
    "numberOfEmployees": "10-50",
    "serviceArea": {
      "@type": "Country",
      "name": "Turkey"
    }
  };

  // WebSite structured data
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": "https://gozcu.tech",
    "description": description,
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": image
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://gozcu.tech/blog?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Service structured data
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Software Development",
    "provider": {
      "@type": "Organization",
      "name": siteName
    },
    "areaServed": {
      "@type": "Country",
      "name": "Turkey"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Yazılım Hizmetleri",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Tasarım ve Programlama"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ERP Yazılım Geliştirme"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bulut Sunucu Hizmetleri"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Özel Yazılım Geliştirme"
          }
        }
      ]
    }
  };

  // LocalBusiness structured data for local SEO
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gözcü Yazılım Teknoloji",
    "alternateName": siteName,
    "image": image,
    "url": url,
    "telephone": contactPhone.replace(/\s/g, "-"),
    "email": contactEmail,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": contactAddress.includes("İstanbul") ? "İstanbul" : contactAddress,
      "addressRegion": "İstanbul",
      "addressCountry": "TR",
      "streetAddress": contactAddress
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.0082",
      "longitude": "28.9784"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$",
    "serviceArea": {
      "@type": "Country",
      "name": "Turkey"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Yazılım Hizmetleri",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Tasarım ve Programlama"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ERP Yazılım Geliştirme"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Bulut Sunucu Hizmetleri"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Özel Yazılım Geliştirme"
          }
        }
      ]
    },
    "sameAs": [
      githubUrl,
      linkedinUrl
    ]
  };
  
  // JSON-LD structured data for articles
  let structuredData = organizationData;

  // Article specific structured data
  if (type === "article") {
    structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": {
        "@type": "ImageObject",
        "url": image,
        "width": 1200,
        "height": 630
      },
      "datePublished": publishedTime || new Date().toISOString(),
      "dateModified": modifiedTime || publishedTime || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": author,
        "url": "https://gozcu.tech"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": image,
          "width": 512,
          "height": 512
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };
    if (section) {
      structuredData.articleSection = section;
    }
    if (tags.length > 0) {
      structuredData.keywords = tags.join(", ");
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Gözcu Yazılım" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Article specific Open Graph */}
      {type === "article" && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@gozcu" />
      <meta property="twitter:creator" content="@gozcu" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Gözcu Yazılım" />

      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>

      {/* Structured Data - WebSite */}
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify(websiteData)}
        </script>
      )}

      {/* Structured Data - Service */}
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify(serviceData)}
        </script>
      )}

      {/* Structured Data - LocalBusiness */}
      {type === "website" && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessData)}
        </script>
      )}

      {/* Structured Data - Article */}
      {type === "article" && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Structured Data - BreadcrumbList */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.url
            }))
          })}
        </script>
      )}

      {/* Language Alternatives (hreflang) */}
      <link rel="alternate" hreflang="tr" href={url} />
      <link rel="alternate" hreflang="en" href={`${url}?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={url} />

      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Turkish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="geo.region" content="TR-34" />
      <meta name="geo.placename" content="İstanbul" />
      <meta name="geo.position" content="41.0082;28.9784" />
      <meta name="ICBM" content="41.0082, 28.9784" />
      
      {/* Mobile specific */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Security */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Performance hints */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default SEO;




