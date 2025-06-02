import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <button className="text-blue-600 text-2xl">&#9776;</button>
        <h1 className="text-2xl font-bold text-blue-600">
          DOCC<span className="text-cyan-500">URE</span>
        </h1>
      </div>
      <div className="flex space-x-3">
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-full flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <span>Sign Up</span>
        </button>
        <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-full flex items-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.75 2h-7.5a2.25 2.25 0 00-2.25 2.25v15.5A2.25 2.25 0 008.25 22h7.5a2.25 2.25 0 002.25-2.25V4.25A2.25 2.25 0 0015.75 2z" />
          </svg>
          <span>Register</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
