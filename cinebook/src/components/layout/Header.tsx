import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>CINEBOOK</h1>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link active">Trang chủ</Link>
          <Link to="/lich-chieu" className="nav-link">Lịch chiếu</Link>
          <Link to="/dat-ve" className="nav-link">Đặt vé</Link>
          <Link to="/ve-chung-toi" className="nav-link">Về chúng tôi</Link>
          <Link to="/dich-vu-tien-ich" className="nav-link">Dịch vụ & Tiện ích</Link>
        </nav>

        <div className="header-actions">
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="btn-login">Đăng ký</Link>
              <Link to="/login" className="btn-register">Đăng nhập</Link>
            </>
          ) : (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button 
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff&bold=true`} 
                  alt={user?.username} 
                  className="user-avatar" 
                />
                <span className="user-name">{user?.username}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={`dropdown-icon ${showUserMenu ? 'open' : ''}`}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showUserMenu && (
                <>
                  <div className="user-dropdown">
                    <div className="user-info">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user?.username}&background=6c63ff&color=fff&bold=true`} 
                        alt={user?.username} 
                        className="dropdown-avatar" 
                      />
                      <div className="user-details">
                        <p className="dropdown-name">{user?.username}</p>
                        <p className="dropdown-email">{user?.role}</p>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Thông tin người dùng
                    </Link>

                    <Link to="/change-password" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Đổi mật khẩu
                    </Link>

                    <Link to="/booking-history" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                      Lịch sử đặt vé
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button onClick={handleLogout} className="dropdown-item logout">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Tìm kiếm phim, rạp..."
          className="search-input"
        />
        <button className="search-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
