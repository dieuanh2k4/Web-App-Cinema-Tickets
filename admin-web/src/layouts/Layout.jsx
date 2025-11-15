import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaFilm,
  FaDoorOpen,
  FaCouch,
  FaClock,
  FaMoneyBillWave,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Tổng quan' },
    { path: '/movies', icon: FaFilm, label: 'Quản lý phim' },
    { path: '/rooms', icon: FaDoorOpen, label: 'Quản lý phòng chiếu' },
    { path: '/seats', icon: FaCouch, label: 'Quản lý ghế ngồi' },
    { path: '/showtimes', icon: FaClock, label: 'Quản lý lịch chiếu' },
    { path: '/ticket-prices', icon: FaMoneyBillWave, label: 'Quản lý giá vé' },
    { path: '/orders', icon: FaShoppingCart, label: 'Quản lý đơn hàng' },
    { path: '/accounts', icon: FaUsers, label: 'Quản lý tài khoản' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-secondary border-r border-gray-700 min-h-screen flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              <span className="border-t border-b border-white px-2 py-1">CINEBOOK</span>
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-accent text-white border-r-4 border-accent'
                  : 'text-gray-400 hover:bg-primary hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-700 p-4">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white flex-shrink-0">
            <FaUser size={18} />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`mt-3 w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <FaSignOutAlt size={18} />
          {!collapsed && <span className="text-sm">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
