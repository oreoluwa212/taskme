import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { HiOutlineViewGrid, HiOutlineFolder, HiOutlineX } from "react-icons/hi";
import { MessageSquare } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { logo } from "../../../public";

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeButton, setActiveButton] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath === "/dashboard" || currentPath === "/") {
      setActiveButton(1);
    } else if (
      currentPath.startsWith("/projects") ||
      currentPath.startsWith("/project/") ||
      currentPath.includes("/project/") ||
      currentPath.includes("/search") ||
      currentPath.includes("subtask")
    ) {
      setActiveButton(2);
    } else if (
      currentPath.startsWith("/chats") ||
      currentPath.includes("/chat/")
    ) {
      setActiveButton(3);
    } else if (currentPath === "/settings") {
      setActiveButton(4);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  const closeSidebar = () => setIsOpen(false);

  const toggleCollapse = () => {
    setIsTransitioning(true);
    setIsCollapsed(!isCollapsed);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const getUserData = () => {
    if (!user)
      return { firstname: "User", email: "", initials: "U", avatar: null };

    let userData = user;

    if (user.data) {
      userData = user.data;
    }

    const firstname = userData.firstname || "User";
    const email = userData.email || "";
    const initials = firstname[0]?.toUpperCase() || "U";
    const avatar = userData.avatar?.url || null;

    return { firstname, email, initials, avatar };
  };

  const { firstname, email, initials, avatar } = getUserData();

  const navigationItems = [
    {
      id: 1,
      title: "Overview",
      path: "/dashboard",
      icon: HiOutlineViewGrid,
    },
    {
      id: 2,
      title: "Projects",
      path: "/projects",
      icon: HiOutlineFolder,
    },
    {
      id: 3,
      title: "Chats",
      path: "/chats",
      icon: MessageSquare,
    },
    {
      id: 4,
      title: "Settings",
      path: "/settings",
      icon: IoIosSettings,
    },
  ];

  const NavItem = ({ item, isActive, showText = true, isMobile = false }) => (
    <Link
      to={item.path}
      onClick={isMobile ? closeSidebar : undefined}
      className={`flex items-center ${
        showText ? "gap-3 px-4" : "justify-center px-2"
      } py-3 rounded-lg transition-all duration-200 group relative ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      title={!showText ? item.title : undefined}
    >
      <item.icon size={20} className="flex-shrink-0" />
      {showText && (
        <span
          className={`font-medium transition-opacity duration-200 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {item.title}
        </span>
      )}
      {!showText && !isMobile && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {item.title}
        </div>
      )}
    </Link>
  );

  const Avatar = ({ size = "w-10 h-10", showTooltip = false }) => (
    <div
      className={`${size} rounded-full flex items-center justify-center overflow-hidden relative group flex-shrink-0`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={firstname}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white font-medium ${
          avatar ? "hidden" : "flex"
        }`}
      >
        {initials}
      </div>
      {showTooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {firstname}
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex lg:flex-col ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        } lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 transition-all duration-300 ease-in-out z-40`}
        style={{
          willChange: isTransitioning ? "width" : "auto",
          transform: "translateZ(0)",
        }}
      >
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div
            className={`flex items-center h-16 border-b border-gray-200 transition-all duration-300 ${
              isCollapsed ? "justify-center px-4" : "px-6"
            }`}
          >
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-300 ${
                isCollapsed ? "h-6 w-auto" : "h-8 w-auto"
              }`}
            />
          </div>

          <div
            className={`flex py-2 transition-all duration-300 ${
              isCollapsed ? "justify-center px-2" : "justify-end px-4"
            }`}
          >
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 flex-shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <HiChevronDoubleRight size={16} />
              ) : (
                <HiChevronDoubleLeft size={16} />
              )}
            </button>
          </div>

          <nav
            className={`flex-1 py-4 space-y-2 overflow-hidden transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            {navigationItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeButton === item.id}
                showText={!isCollapsed}
              />
            ))}
          </nav>

          <div
            className={`border-t border-gray-200 p-4 transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            <div
              className={`flex items-center transition-all duration-300 ${
                isCollapsed ? "justify-center mb-2" : "gap-3 mb-4"
              }`}
            >
              <Avatar showTooltip={isCollapsed} />
              {!isCollapsed && (
                <div
                  className={`flex-1 min-w-0 transition-opacity duration-200 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {firstname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center transition-all duration-200 text-red-600 hover:bg-red-50 rounded-lg group relative ${
                isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
              }`}
              title={isCollapsed ? "Logout" : undefined}
            >
              <HiOutlineLogout size={20} className="flex-shrink-0" />
              {!isCollapsed && (
                <span
                  className={`font-medium transition-opacity duration-200 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Logout
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeSidebar}
          />

          <div className="relative flex flex-col w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out">
            <button
              onClick={closeSidebar}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
              aria-label="Close sidebar"
            >
              <HiOutlineX size={20} />
            </button>

            <div className="flex items-center h-16 px-6 border-b border-gray-200">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeButton === item.id}
                  isMobile={true}
                />
              ))}
            </nav>

            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {firstname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <HiOutlineLogout size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`hidden lg:block lg:flex-shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      />
    </>
  );
};

export default Sidebar;
