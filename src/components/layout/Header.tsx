"use client";
import { LogOut, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm font-sans">
      <div className="flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Medicore HMS
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            MediCore Hospital & Research Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-700">
            Usman Sagheer
          </span>
          <span className="text-xs text-blue-600">Receptionist</span>
        </div>

        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm ring-1 ring-blue-50 transition-all hover:bg-blue-200 focus:outline-none"
        >
          US
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User size={16} className="text-gray-400" />
              My Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={16} className="text-gray-400" />
              Settings
            </button>
            <div className="h-px bg-gray-100 my-1"></div>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
