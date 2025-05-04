import React from "react";

export default function LoadingSpinner({ size = "medium", color = "blue" }) {
  const sizeClass = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClass = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClass[size]} ${colorClass[color]}`}
        style={{ borderTopColor: "transparent" }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}