// src/components/ui/Table.jsx

export const Table = ({ children, className = "" }) => {
    return (
      <table className={`min-w-full border border-gray-300 ${className}`}>
        {children}
      </table>
    );
  };
  
  export const TableHeader = ({ children }) => {
    return <thead className="bg-gray-100">{children}</thead>;
  };
  
  export const TableRow = ({ children }) => {
    return <tr className="border-b">{children}</tr>;
  };
  
  export const TableHead = ({ children }) => {
    return <th className="px-4 py-2 text-left">{children}</th>;
  };
  
  export const TableBody = ({ children }) => {
    return <tbody>{children}</tbody>;
  };
  
  export const TableCell = ({ children }) => {
    return <td className="px-4 py-2">{children}</td>;
  };
  