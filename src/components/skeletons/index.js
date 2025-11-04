import React from "react";

// Simple skeleton components without JSX syntax issues
export const BlogCardSkeleton = () => {
  return React.createElement(
    "div",
    {
      className:
        "bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm",
    },
    React.createElement("div", {
      className:
        "aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse",
    }),
    React.createElement(
      "div",
      { className: "p-6" },
      React.createElement("div", {
        className:
          "h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse mb-3",
      }),
      React.createElement(
        "div",
        { className: "space-y-2 mb-3" },
        React.createElement("div", {
          className: "h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        }),
        React.createElement("div", {
          className:
            "h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        })
      ),
      React.createElement(
        "div",
        { className: "space-y-2 mb-4" },
        React.createElement("div", {
          className: "h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        }),
        React.createElement("div", {
          className: "h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        }),
        React.createElement("div", {
          className:
            "h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        })
      ),
      React.createElement(
        "div",
        { className: "flex items-center justify-between mb-4" },
        React.createElement(
          "div",
          { className: "flex items-center gap-4" },
          React.createElement("div", {
            className:
              "h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
          }),
          React.createElement("div", {
            className:
              "h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
          })
        ),
        React.createElement("div", {
          className:
            "h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse",
        })
      ),
      React.createElement("div", {
        className:
          "h-10 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse",
      })
    )
  );
};

export const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    blue: "border-blue-600",
    white: "border-white",
    slate: "border-slate-600",
  };

  return React.createElement("div", {
    className: `${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`,
  });
};

export const LoadingOverlay = ({ message = "Yükleniyor..." }) => {
  return React.createElement(
    "div",
    {
      className:
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    },
    React.createElement(
      "div",
      { className: "bg-white dark:bg-slate-800 rounded-xl p-8 text-center" },
      React.createElement(LoadingSpinner, { size: "lg" }),
      React.createElement(
        "p",
        { className: "mt-4 text-slate-600 dark:text-slate-400" },
        message
      )
    )
  );
};

export default {
  BlogCardSkeleton,
  LoadingSpinner,
  LoadingOverlay,
};
