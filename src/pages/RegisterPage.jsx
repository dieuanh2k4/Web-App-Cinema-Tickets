// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hiển thị thông báo thành công
    alert('✅ Đăng ký thành công!');

    // Chuyển về trang chủ sau 500ms
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      {/* Background with movie posters blur */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) brightness(0.3)',
          zIndex: 1,
        }}
      />

      {/* Logo */}
      <a
        href="/"
        style={{
          position: 'absolute',
          top: '30px',
          left: '50px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          letterSpacing: '2px',
          textDecoration: 'none',
          zIndex: 10,
          borderBottom: '3px solid white',
          paddingBottom: '5px',
        }}
      >
        CINEBOOK
      </a>

      {/* Register Form Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '50px 60px',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Title */}
        <h1
          style={{
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          Tạo tài khoản
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Tên đăng nhập"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '30px' }}>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = '#667eea';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            Đăng ký
          </button>
        </form>

        {/* Login Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
          }}
        >
          Bạn đã có tài khoản?{' '}
          <a
            href="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
