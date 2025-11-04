import React, { useState, useEffect } from "react";

const PhoneInput = ({ value, onChange, placeholder, className, ...props }) => {
  const [displayValue, setDisplayValue] = useState("");
  const [fullValue, setFullValue] = useState("");

  useEffect(() => {
    if (value) {
      // Eğer +90 ile başlıyorsa, sadece numara kısmını göster
      if (value.startsWith("+90")) {
        const phoneNumber = value.replace("+90", "").trim();
        setDisplayValue(phoneNumber);
        setFullValue(value);
      } else {
        setDisplayValue(value);
        setFullValue(value.startsWith("+90") ? value : `+90 ${value}`);
      }
    } else {
      setDisplayValue("");
      setFullValue("");
    }
  }, [value]);

  const formatPhoneNumber = (input) => {
    // Sadece rakamları al
    const numbers = input.replace(/\D/g, "");

    // Türkiye telefon numarası kontrolü
    if (numbers.length === 0) return "";

    // Mobil numara (5XX ile başlar)
    if (numbers.startsWith("5") && numbers.length <= 10) {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 8)
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
          6
        )}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
        6,
        8
      )} ${numbers.slice(8, 10)}`;
    }

    // Sabit hat (2XX ile başlar)
    if (numbers.startsWith("2") && numbers.length <= 10) {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6)
        return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
      if (numbers.length <= 8)
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
          6
        )}`;
      return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(
        6,
        8
      )} ${numbers.slice(8, 10)}`;
    }

    // Diğer durumlar için basit format
    return numbers;
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);

    setDisplayValue(formatted);

    // Tam değeri oluştur (+90 ile)
    const numbers = input.replace(/\D/g, "");
    if (numbers.length > 0) {
      const fullPhone = `+90 ${formatted}`;
      setFullValue(fullPhone);
      onChange?.(fullPhone);
    } else {
      setFullValue("");
      onChange?.("");
    }
  };

  const isValidTurkishPhone = (phone) => {
    // Artık her telefonu geçerli kabul ediyoruz
    return true;
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return "5XX XXX XX XX veya 2XX XXX XX XX";
  };

  return (
    <div className="relative">
      <input
        {...props}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={getPlaceholder()}
        className={className}
        maxLength={15} // Formatlanmış hali için
      />

      {/* +90 Prefix Gösterimi */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
        +90
      </div>

      {/* Validation Mesajı - Artık göstermiyoruz */}
    </div>
  );
};

export default PhoneInput;
