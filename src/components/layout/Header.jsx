import { useState, useRef, useEffect } from 'react';
import { Menu, BellDot, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar, user }) => {
  const { logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  return (
    <header className="z-10 py-4 px-6 bg-white shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 ml-2 lg:ml-0">
          {user?.role === 'admin' ? 'Admin Dashboard' : 
            user?.role === 'manager' ? 'Manager Dashboard' : 'User Dashboard'}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={toggleNotifications}
          >
            <span className="relative">
              <BellDot size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
              <div className="py-2 px-4 bg-blue-500 text-white text-sm font-medium">
                Notifications
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="py-3 px-4 border-b hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">New asset request</p>
                  <p className="text-xs text-gray-500">Sarah Wilson requested a new monitor</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="py-3 px-4 border-b hover:bg-gray-50 cursor-pointer">
                  <p className="text-sm font-medium text-gray-900">Asset complaint resolved</p>
                  <p className="text-xs text-gray-500">Your complaint about the MacBook Pro has been resolved</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
              <a href="#" className="block bg-gray-50 text-center py-2 text-sm font-medium text-blue-500 hover:bg-gray-100">
                View all notifications
              </a>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfileDropdown}
            className="flex items-center text-sm rounded-full focus:outline-none"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user?.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"}
              alt="User avatar"
            />
            <div className="hidden md:flex md:items-center ml-2">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Settings
              </a>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;