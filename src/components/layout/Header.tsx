"use client";
import { LogOut, Settings, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useAppDispatch } from "@/redux/hooks";
import { logout, logoutUser } from "@/redux/slices/authSlice";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsDropdownOpen(false);
    router.push("/auth/login");
  };

  const isDoctor = pathname?.includes("/dashboard/doctor");
  const isReception = pathname?.includes("/dashboard/receptionist");
  const isAdmin = pathname?.includes("/dashboard/admin");

  const userInfo = {
    name: isDoctor
      ? "Dr. Usman Sagheer"
      : isAdmin
        ? "Admin Control"
        : "Usman Sagheer",
    role: isDoctor
      ? "Hospital Doctor"
      : isAdmin
        ? "System Admin"
        : "Receptionist",
    initials: isAdmin ? "AD" : isDoctor ? "DS" : "US",
  };

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
    <header className="h-[70px] bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm font-sans shrink-0">
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
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            MediCore Hospital & Research Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-gray-800">
            {userInfo.name}
          </span>
          <span className="text-[10px] font-black uppercase text-blue-600 tracking-tighter">
            {userInfo.role}
          </span>
        </div>

        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm ring-1 ring-blue-50 transition-all hover:bg-blue-200 focus:outline-none"
        >
          {userInfo.initials}
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                User Menu
              </p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-all rounded-xl"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <User size={16} className="text-slate-400" />
              </div>
              <span className="font-semibold">My Profile</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 transition-all rounded-xl"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Settings size={16} className="text-slate-400" />
              </div>
              <span className="font-semibold">Settings</span>
            </Button>
            <div className="h-px bg-gray-100 my-2 mx-2"></div>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all rounded-xl"
              onClick={handleLogout}
            >
              <LogOut size={16} className="text-red-500" />
              <span className="font-bold">Logout</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
