"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  Settings,
  UserCircle,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Building2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarConfig {
  [key: string]: SidebarItem[];
}

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = user?.role?.toLowerCase() || "doctor";
  const doctorId = user?.doctor?.id || user?.doctorId;

  const sidebarConfig: SidebarConfig = {
    doctor: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}`,
      },
      {
        id: "patients",
        label: "My Patients",
        icon: <Users className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/patients`,
      },
      {
        id: "appointments",
        label: "Appointments",
        icon: <Calendar className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/appointments`,
      },
      {
        id: "schedule",
        label: "Schedule",
        icon: <Clock className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/schedule`,
      },
      {
        id: "consultations",
        label: "Consultations",
        icon: <Stethoscope className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/consultations`,
      },
      {
        id: "records",
        label: "Medical Records",
        icon: <FileText className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/records`,
      },
      {
        id: "profile",
        label: "Profile",
        icon: <UserCircle className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/profile`,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        href: `/dashboard/doctor/${doctorId}/settings`,
      },
    ],
    receptionist: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: "/dashboard/receptionist",
      },
      {
        id: "registration",
        label: "Patient Registration",
        icon: <UserPlus className="w-5 h-5" />,
        href: "/dashboard/receptionist/registration",
      },
      {
        id: "appointments",
        label: "Appointments",
        icon: <Calendar className="w-5 h-5" />,
        href: "/dashboard/receptionist/appointments",
      },
      {
        id: "queue",
        label: "Queue Management",
        icon: <ClipboardList className="w-5 h-5" />,
        href: "/dashboard/receptionist/queue",
      },
      {
        id: "profile",
        label: "Profile",
        icon: <UserCircle className="w-5 h-5" />,
        href: "/dashboard/receptionist/profile",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        href: "/dashboard/receptionist/settings",
      },
    ],
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
        href: "/dashboard/admin",
      },
      {
        id: "doctors",
        label: "Manage Doctors",
        icon: <Stethoscope className="w-5 h-5" />,
        href: "/dashboard/admin/doctors",
      },
      {
        id: "staff",
        label: "Manage Staff",
        icon: <Users className="w-5 h-5" />,
        href: "/dashboard/admin/staff",
      },
      {
        id: "departments",
        label: "Departments",
        icon: <Building2 className="w-5 h-5" />,
        href: "/dashboard/admin/departments",
      },
      {
        id: "reports",
        label: "Reports",
        icon: <BarChart3 className="w-5 h-5" />,
        href: "/dashboard/admin/reports",
      },
      {
        id: "profile",
        label: "Profile",
        icon: <UserCircle className="w-5 h-5" />,
        href: "/dashboard/admin/profile",
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className="w-5 h-5" />,
        href: "/dashboard/admin/settings",
      },
    ],
  };

  const currentItems = sidebarConfig[userRole] || sidebarConfig.doctor;

  const isActiveRoute = (href: string) => {
    if (href === pathname) return true;

    return false;
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      className={`
        ${isCollapsed ? "w-20" : "w-64"} 
        h-full bg-white border-r border-gray-200 
        flex flex-col transition-all duration-300 ease-in-out
        shadow-sm
      `}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{
                background:
                  "linear-gradient(to bottom right, #2563eb, #1d4ed8)",
              }}
            >
              M
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">MediCore</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
                {userRole === "doctor" && "Doctor Panel"}
                {userRole === "receptionist" && "Reception Panel"}
                {userRole === "admin" && "Admin Panel"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 
            transition-colors ${isCollapsed ? "mx-auto" : ""}
          `}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {currentItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.href)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <span
                className={`
                  ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"}
                  transition-colors
                `}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div
              className="w-10 h-10 rounded-full  flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{
                background:
                  "linear-gradient(to bottom right, #2563eb, #1d4ed8)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
