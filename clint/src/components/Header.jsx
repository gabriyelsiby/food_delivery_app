// filepath: c:\Users\gabriyel\OneDrive\Desktop\food-delivery-app\src\components\Header.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Food Delivery App</h1>
      <nav>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/foods" className="mr-4">Menu</Link>
        <Link to="/cart" className="mr-4">Cart</Link>
        {user ? (
          <>
            <Link to="/profile" className="mr-4">Profile</Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/signup" className="mr-4">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;