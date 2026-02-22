import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { FaUsers, FaChartBar, FaHome, FaSchool } from "react-icons/fa";
import { FiSidebar } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSidebar() {
  const { user } = useAuth();
  const [collapsed /*setCollapsed*/] = useState(false);

  const menu = [
    {
      path: "/120503",
      label: "Dashboard",
      icon: <FaHome size={22} />,
    },
    {
      path: "/120503/users",
      label: "Users",
      icon: <FaUsers size={22} />,
    },
    {
      path: "/120503/stats",
      label: "Stats",
      icon: <FaChartBar size={22} />,
    },
    {
      path: "/120503/classrooms",
      label: "Classrooms",
      icon: <FaSchool size={22} />,
    },
  ];

  return (
    <aside
      className={`bg-base-200 min-h-screen border-r border-base-300 transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}
      hidden md:flex flex-col shadow-sm fixed left-0 top-0`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        {!collapsed && (
          <Link to="/120503" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">Admin</span>
          </Link>
        )}

        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-md btn-circle hover:bg-primary hover:text-white transition"
        >
          <FiSidebar size={20} />
        </button> */}
      </div>

      {/* Admin Info */}
      <div className="flex items-center gap-3 p-3 border-b border-base-300">
        <div className="avatar placeholder">
          <div className="bg-primary text-white rounded-full w-10 flex items-center justify-center text-lg font-bold">
            {(() => {
              const name = user?.name || "";
              const parts = name.trim().split(" ").filter(Boolean);

              if (parts.length === 0) return "C";
              if (parts.length === 1) return parts[0][0];

              return parts[0][0] + parts[parts.length - 1][0];
            })()}
          </div>
        </div>

        {!collapsed && (
          <div>
            <p className="font-semibold leading-none">{user?.name}</p>
            <p className="text-xs opacity-60 mt-1">Administrator</p>
          </div>
        )}
      </div>

      {/* Menu */}
      <ul className="menu grow w-full p-2">
        {menu.map((item) => (
          <li key={item.path} className="my-1">
            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-base-300 transition"
                }`
              }
            >
              {item.icon}
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="border-t border-base-300 p-2">
        {!collapsed && (
          <p className="text-xs text-center opacity-70 py-2">
            © {new Date().getFullYear()} Admin Panel
          </p>
        )}
      </div>
    </aside>
  );
}
