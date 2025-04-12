// src/components/ui/Select.jsx

export const Select = ({ value, onValueChange, children, className = "" }) => {
    return (
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`border rounded p-2 ${className}`}
      >
        {children}
      </select>
    );
  };
  
  export const SelectItem = ({ value, children }) => {
    return (
      <option value={value}>
        {children}
      </option>
    );
  };
  