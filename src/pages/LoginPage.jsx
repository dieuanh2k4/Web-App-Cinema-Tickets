// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hiển thị thông báo thành công
    alert('✅ Đăng nhập thành công!');

    // Chuyển về trang chủ sau 500ms
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleSocialLogin = (provider) => {
    alert(`✅ Đăng nhập ${provider} thành công!`);
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

      {/* Login Form Container */}
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
          Đăng Nhập
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: '30px' }}>
            <a
              href="#"
              style={{
                color: '#667eea',
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Social Login Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginBottom: '25px',
            }}
          >
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span style={{ color: 'white' }}>G</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span style={{ color: 'white' }}>f</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('apple')}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span style={{ color: 'white' }}></span>
            </button>
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
            Đăng nhập
          </button>
        </form>

        {/* Sign Up Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
          }}
        >
          Bạn chưa có tài khoản?{' '}
          <a
            href="/register"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Đăng ký ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
