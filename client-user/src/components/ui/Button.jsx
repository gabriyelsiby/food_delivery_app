// ✅ Button.jsx
const Button = ({ children, className = "", ...props }) => {
    return (
      <button
        className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition duration-200 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  