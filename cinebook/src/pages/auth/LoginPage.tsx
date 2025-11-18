import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',  //  Đổi từ email sang username
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // ✅ MOCK DATA - Tài khoản giả để test
      const MOCK_USERS = [
        { 
          username: 'edzorc', 
          password: '12345', 
          role: 'Customer',
          fullName: 'Edzorc'
        },
        { 
          username: 'admin', 
          password: 'admin123', 
          role: 'Admin',
          fullName: 'Administrator'
        },
        { 
          username: 'phamhoai09112004@gmail.com', 
          password: '123456', 
          role: 'Customer',
          fullName: 'Phạm Hoài'
        }
      ];

      // Giả lập delay API (1 giây)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // ✅ Tìm user - so sánh đúng với username
      const mockUser = MOCK_USERS.find(
        u => u.username === formData.username && u.password === formData.password
      );

      if (!mockUser) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng!');
      }

      // Đăng nhập thành công
      login({
        username: mockUser.fullName,
        role: mockUser.role,
        token: 'mock-jwt-token-' + Date.now()
      });

      // Chuyển về trang chủ
      navigate('/');

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    login({
      username: 'Google User',
      role: 'Customer',
      token: 'mock-google-token-' + Date.now()
    });
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <Link to="/" className="auth-logo">
          <h1>CINEBOOK</h1>
        </Link>

        <div className="movie-posters">
          <img src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150" alt="Movie 1" />
          <img src="https://images.unsplash.com/photo-1574267432644-f74f8ec21d44?w=150" alt="Movie 2" />
          <img src="https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=150" alt="Movie 3" />
          <img src="https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=150" alt="Movie 4" />
          <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150" alt="Movie 5" />
          <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150" alt="Movie 6" />
        </div>

        <div className="auth-container">
          <h2 className="auth-title">Đăng Nhập</h2>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="username"  
              placeholder="Tên đăng nhập"
              value={formData.username}  
              onChange={handleChange}
              className="auth-input"
              required
              disabled={isLoading}
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
              disabled={isLoading}
            />

            <Link to="/forgot-password" className="forgot-link">
              Quên mật khẩu?
            </Link>

            <div className="social-login">
              <span className="social-label">Hoặc</span>
              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="social-btn google-btn" 
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Đăng nhập với Google
              </button>
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-footer">
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link> ngay
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;