import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    } catch (error) {
      setError('Đã xảy ra lỗi khi đăng nhập');
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
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-center items-start space-y-8">
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-600 rounded-lg blur opacity-25"></div>
                <h1 className="relative text-6xl xl:text-7xl font-bold text-white">
                  <span className="bg-gradient-to-r from-accent via-purple-400 to-purple-600 bg-clip-text text-transparent">
                    CINEBOOK
                  </span>
                </h1>
              </div>
              <div className="space-y-2">
                <p className="text-xl text-gray-200 leading-relaxed">
                  Hệ thống quản lý đặt vé xem phim
                </p>
              </div>
              <div className="h-1 w-24 bg-gradient-to-r from-accent to-purple-600 rounded-full"></div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:col-span-3 w-full">
            {/* Logo for mobile */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-accent via-purple-400 to-purple-600 bg-clip-text text-transparent">
                  CINEBOOK
                </span>
              </h1>
              <p className="text-gray-400">Hệ thống quản lý rạp chiếu phim</p>
            </div>

            <div className="bg-secondary/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-700/50">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Đăng nhập</h2>
                <p className="text-gray-400 text-lg">Truy cập vào hệ thống quản trị</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tài khoản</label>
                  <input
                    type="text"
                    placeholder="Nhập tài khoản"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-5 py-4 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-primary/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all text-lg"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-5 py-4 rounded-xl text-sm flex items-center gap-3">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-accent to-purple-600 hover:from-accent/90 hover:to-purple-600/90 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25 text-lg mt-8"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
