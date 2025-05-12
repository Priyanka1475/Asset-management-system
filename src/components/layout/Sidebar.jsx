// Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  X, 
  Home, 
  Monitor, 
  ClipboardList, 
  MessageSquare, 
  Users, 
  Package, 
  Clipboard, 
  BarChart3, 
  ListChecks,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
  const getNavItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { to: '/admin', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/admin/assets', icon: <Monitor size={20} />, label: 'Assets' },
          { to: '/admin/categories', icon: <ListChecks size={20} />, label: 'Categories' },
          { to: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
        ];
      case 'manager':
        return [
          { to: '/manager', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/manager/employees', icon: <Users size={20} />, label: 'Employees' },
          { to: '/manager/assets', icon: <Monitor size={20} />, label: 'Asset Assignment' },
          { to: '/manager/inventory', icon: <Clipboard size={20} />, label: 'Inventory' },
        ];
      default:
        return [
          { to: '/user', icon: <Home size={20} />, label: 'Dashboard' },
          { to: '/user/assets', icon: <Monitor size={20} />, label: 'My Assets' },
          { to: '/user/requests', icon: <ClipboardList size={20} />, label: 'Requests' },
          { to: '/user/complaints', icon: <MessageSquare size={20} />, label: 'Complaints' },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">AssetFlow</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg text-gray-600 transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'hover:bg-gray-50'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-0 w-full left-0 p-4 border-t">
            <NavLink
              to="/settings"
              className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Settings size={20} />
              <span className="ml-3">Settings</span>
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
