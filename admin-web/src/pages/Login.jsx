import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaFilm, FaChartLine } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#16213e] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4">
                <span className="border-t-4 border-b-4 border-white px-6 py-3 inline-block">CINEBOOK</span>
              </h1>
              <p className="text-xl text-gray-300">Hệ thống quản lý rạp chiếu phim</p>
              <p className="text-gray-400">Quản lý toàn bộ hoạt động của rạp phim một cách hiệu quả và chuyên nghiệp</p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaFilm className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Quản lý phim</h3>
                  <p className="text-sm text-gray-400">Thêm, sửa, xóa thông tin phim dễ dàng</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaChartLine className="text-purple-400" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Thống kê doanh thu</h3>
                  <p className="text-sm text-gray-400">Báo cáo chi tiết và trực quan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full">
            {/* Logo for mobile */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="border-t-2 border-b-2 border-white px-4 py-2 inline-block">CINEBOOK</span>
              </h1>
            </div>

            <div className="bg-secondary/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Đăng nhập</h2>
              <p className="text-gray-400 mb-8">Truy cập vào hệ thống quản trị</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tài khoản</label>
                  <input
                    type="text"
                    placeholder="Nhập tài khoản"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-600/90 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                  <span>🔑</span>
                  <span>Tài khoản demo để thử nghiệm:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div 
                    className="bg-gradient-to-br from-blue-600/10 to-blue-600/5 border border-blue-600/20 px-4 py-3 rounded-xl hover:border-blue-600/40 transition-colors cursor-pointer" 
                    onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                  >
                    <div className="font-semibold text-blue-400 mb-1">Admin</div>
                    <div className="text-gray-400">admin / admin123</div>
                  </div>
                  <div 
                    className="bg-gradient-to-br from-purple-600/10 to-purple-600/5 border border-purple-600/20 px-4 py-3 rounded-xl hover:border-purple-600/40 transition-colors cursor-pointer" 
                    onClick={() => { setUsername('staff'); setPassword('staff123'); }}
                  >
                    <div className="font-semibold text-purple-400 mb-1">Staff</div>
                    <div className="text-gray-400">staff / staff123</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
