import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
    // TODO: Call API register
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
          <h2 className="auth-title">Tạo tài khoản</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="name"
              placeholder="Tên đăng nhập"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              required
            />

            <button type="submit" className="auth-button">
              Đăng ký
            </button>
          </form>

          <p className="auth-footer">
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link> ngay
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;