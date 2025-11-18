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
      } bg-gradient-to-b from-secondary to-secondary/50 border-r border-gray-700/50 min-h-screen flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/30 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center animate-fade-in">
            <h1 className="text-xl font-bold text-white">
              <span className="border-t-2 border-b-2 border-accent px-3 py-1.5 inline-block">CINEBOOK</span>
            </h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-all p-2 hover:bg-primary/50 rounded-lg"
        >
          {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg shadow-accent/25'
                    : 'text-gray-400 hover:bg-primary/50 hover:text-white'
                }`}
                title={collapsed ? item.label : ''}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                  isActive ? 'bg-white/10' : 'group-hover:bg-white/5'
                }`}>
                  <Icon size={20} className="flex-shrink-0" />
                </div>
                {!collapsed && <span className="text-sm font-medium animate-fade-in">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-700/30 p-4 space-y-3">
        <div className={`flex items-center gap-3 p-3 bg-primary/30 rounded-xl ${
          collapsed ? 'justify-center' : ''
        }`}>
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg relative">
            <FaUser size={18} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-secondary rounded-full"></div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 capitalize flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {user?.role}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <FaSignOutAlt size={18} />
          {!collapsed && <span className="text-sm font-medium">Đăng xuất</span>}
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
