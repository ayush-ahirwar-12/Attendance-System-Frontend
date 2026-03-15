"use client"

import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md relative z-50">
      {/* Left Side: Website Name */}
      <div className="text-xl font-bold tracking-wide cursor-pointer">
        AI Resume Extractor
      </div>

      {/* Right Side: User Button & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-10 flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <span className="font-medium">Puneet Yadav</span>
          
          {/* Chevron Icon */}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Invisible Overlay 
          This covers the whole screen when the menu is open. 
          Clicking it sets isOpen to false.
        */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Dropdown Modal */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg border border-gray-200 overflow-hidden z-20 flex flex-col">
            <button 
              className="px-4 py-3 text-left font-medium hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={() => {
                console.log("Navigate to Profile");
                setIsOpen(false); // Close menu on click
              }}
            >
              Profile
            </button>
            <button 
              className="px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                console.log("Trigger Logout");
                setIsOpen(false); // Close menu on click
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;