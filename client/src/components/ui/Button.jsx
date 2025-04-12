// src/components/ui/Button.jsx

export const Button = ({ children, onClick, className = "", type = "button" }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 ${className}`}
      >
        {children}
      </button>
    );
  };
  