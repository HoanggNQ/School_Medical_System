import React from "react";

const Navbar = () => {
  return (
    <header className="w-full flex justify-between items-center p-4 shadow-md">
      <div className="text-2xl font-bold text-blue-600">
        DOCCURE
      </div>
      <nav className="space-x-6 hidden md:flex">
        <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Doctors</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Patients</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Pharmacy</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Pages</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Blog</a>
        <a href="#" className="text-gray-700 hover:text-blue-600">Admin</a>
      </nav>
      <div className="space-x-2">
        <button className="px-4 py-2 bg-cyan-400 text-white rounded-full">Sign Up</button>
        <button className="px-4 py-2 bg-blue-900 text-white rounded-full">Register</button>
      </div>
    </header>
  );
}

export default Navbar;
