import React from "react";

// Accessibility utilities
export const AccessibilityUtils = {
  // Generate unique IDs for form elements
  generateId: (prefix = "element") => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Focus management
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener("keydown", handleTabKey);
    return () => element.removeEventListener("keydown", handleTabKey);
  },

  // Announce to screen readers
  announceToScreenReader: (message, priority = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },

  // Skip link component
  SkipLink: ({ href, children }) =>
    React.createElement(
      "a",
      {
        href: href,
        className:
          "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50",
      },
      children
    ),

  // Screen reader only text
  ScreenReaderOnly: ({ children }) =>
    React.createElement("span", { className: "sr-only" }, children),

  // Focus visible indicator
  FocusVisible: ({ children, className = "" }) =>
    React.createElement(
      "div",
      {
        className: `focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`,
      },
      children
    ),
};

// Accessible Button Component
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = "",
  ...props
}) => {
  return React.createElement(
    "button",
    {
      onClick: onClick,
      disabled: disabled,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      className: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`,
      ...props,
    },
    children
  );
};

// Accessible Input Component
export const AccessibleInput = ({
  label,
  error,
  required = false,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || AccessibilityUtils.generateId("input");
  const errorId = `${inputId}-error`;

  return React.createElement(
    "div",
    { className: "space-y-2" },
    React.createElement(
      "label",
      {
        htmlFor: inputId,
        className:
          "block text-sm font-medium text-slate-700 dark:text-slate-300",
      },
      label,
      required &&
        React.createElement(
          "span",
          { className: "text-red-500 ml-1", "aria-label": "zorunlu alan" },
          "*"
        )
    ),
    React.createElement("input", {
      id: inputId,
      "aria-invalid": error ? "true" : "false",
      "aria-describedby": error ? errorId : undefined,
      "aria-required": required,
      className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? "border-red-500" : "border-slate-300 dark:border-slate-600"
      } ${className}`,
      ...props,
    }),
    error &&
      React.createElement(
        "div",
        {
          id: errorId,
          role: "alert",
          className: "text-sm text-red-600 dark:text-red-400",
        },
        error
      )
  );
};

export default AccessibilityUtils;
