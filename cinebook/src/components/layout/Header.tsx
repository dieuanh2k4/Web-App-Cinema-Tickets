import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
          <button className="btn-login">Đăng ký</button>
          <button className="btn-register">Đăng nhập</button>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Tìm kiếm"
          className="search-input"
        />
      </div>
    </header>
  );
};

export default Header;