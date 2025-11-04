// Form Validation Utilities for Gözcu Yazılım
export const ValidationUtils = {
  // Email validation
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email)
        ? ""
        : "Geçerli bir e-posta adresi giriniz",
    };
  },

  // Phone validation (Turkish format)
  validatePhone: (phone) => {
    // Artık her telefonu geçerli kabul ediyoruz
    return {
      isValid: true,
      message: "",
    };
  },

  // Name validation
  validateName: (name) => {
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,50}$/;
    return {
      isValid: nameRegex.test(name.trim()),
      message: nameRegex.test(name.trim())
        ? ""
        : "Ad soyad 2-50 karakter arasında olmalı ve sadece harf içermelidir",
    };
  },

  // Message validation
  validateMessage: (message) => {
    return {
      isValid: message.trim().length >= 10 && message.trim().length <= 1000,
      message:
        message.trim().length < 10
          ? "Mesaj en az 10 karakter olmalıdır"
          : message.trim().length > 1000
          ? "Mesaj en fazla 1000 karakter olabilir"
          : "",
    };
  },

  // Project type validation
  validateProjectType: (projectType) => {
    const validTypes = ["Web", "ERP", "Bulut", "Özel"];
    return {
      isValid: validTypes.includes(projectType),
      message: validTypes.includes(projectType)
        ? ""
        : "Geçerli bir proje türü seçiniz",
    };
  },

  // Newsletter email validation
  validateNewsletterEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email)
        ? ""
        : "Geçerli bir e-posta adresi giriniz",
    };
  },

  // Form validation with all fields
  validateContactForm: (formData) => {
    const errors = {};
    let isValid = true;

    // Name validation
    const nameValidation = ValidationUtils.validateName(formData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.message;
      isValid = false;
    }

    // Email validation
    const emailValidation = ValidationUtils.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message;
      isValid = false;
    }

    // Phone validation (required)
    const phoneValidation = ValidationUtils.validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
      isValid = false;
    }

    // Project type validation
    const projectTypeValidation = ValidationUtils.validateProjectType(
      formData.projectType
    );
    if (!projectTypeValidation.isValid) {
      errors.projectType = projectTypeValidation.message;
      isValid = false;
    }

    // Message validation
    const messageValidation = ValidationUtils.validateMessage(formData.message);
    if (!messageValidation.isValid) {
      errors.message = messageValidation.message;
      isValid = false;
    }

    return {
      isValid,
      errors,
    };
  },

  // Newsletter form validation
  validateNewsletterForm: (email) => {
    return ValidationUtils.validateNewsletterEmail(email);
  },

  // Sanitize input
  sanitizeInput: (input) => {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .substring(0, 1000); // Limit length
  },

  // Check for spam patterns
  detectSpam: (message) => {
    const spamPatterns = [
      /http[s]?:\/\/[^\s]+/gi, // URLs
      /[A-Z]{5,}/g, // Excessive caps
      /(.)\1{4,}/g, // Repeated characters
      /(free|win|prize|money|cash|loan|credit)/gi, // Spam keywords
    ];

    return spamPatterns.some((pattern) => pattern.test(message));
  },

  // Rate limiting check
  checkRateLimit: (key, maxAttempts = 3, windowMs = 60000) => {
    const now = Date.now();
    const attempts = JSON.parse(
      localStorage.getItem(`rate_limit_${key}`) || "[]"
    );

    // Remove old attempts
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return {
        allowed: false,
        remainingTime: Math.ceil((recentAttempts[0] + windowMs - now) / 1000),
      };
    }

    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));

    return {
      allowed: true,
      remainingTime: 0,
    };
  },

  // Honeypot validation (hidden field should remain empty)
  validateHoneypot: (honeypotValue) => {
    return {
      isValid: !honeypotValue || honeypotValue.trim() === "",
      message: honeypotValue ? "Bot tespit edildi" : "",
    };
  },

  // Real-time validation for form fields
  getFieldValidationClass: (field, errors) => {
    if (errors[field]) {
      return "border-red-500 focus:border-red-500 focus:ring-red-500";
    }
    return "border-slate-300 focus:border-blue-500 focus:ring-blue-500";
  },

  // Format phone number
  formatPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11 && cleaned.startsWith("0")) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    }
    return phone;
  },

  // Validate file upload
  validateFileUpload: (
    file,
    maxSizeMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/gif"]
  ) => {
    const errors = [];

    if (!file) {
      return { isValid: true, errors: [] };
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push("Sadece JPEG, PNG ve GIF dosyaları kabul edilir");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default ValidationUtils;
