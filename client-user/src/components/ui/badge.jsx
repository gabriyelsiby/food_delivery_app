const badgeColors = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-700",
    destructive: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-700",
  };
  
  export const Badge = ({ children, variant = "default", className = "" }) => {
    const colorClass = badgeColors[variant] || badgeColors.default;
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
        {children}
      </span>
    );
  };
  