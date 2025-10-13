// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Lịch chiếu', path: '/schedule' },
    { name: 'Phim vé', path: '/movies' },
    { name: 'Về chúng tôi', path: '/about' },
    { name: 'Dịch vụ & Tiện ích', path: '/services' },
  ];

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 80px',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          letterSpacing: '2px',
          textDecoration: 'none',
        }}
      >
        CINEBOOK
      </Link>

      {/* Navigation Menu */}
      <nav
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: index === 0 ? '600' : '400',
              borderBottom: index === 0 ? '2px solid #6366f1' : 'none',
              paddingBottom: '4px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#6366f1';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'white';
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Auth Buttons */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Đăng ký
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Đăng nhập
        </button>
      </div>
    </header>
  );
};

export default Header;
