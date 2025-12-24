import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserCircle } from 'react-icons/fa';
import userService from '../services/userService';

const AddAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'Staff' // Default to Staff (string)
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = 'Tên đăng nhập phải có từ 3 đến 20 ký tự';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 5 || formData.password.length > 20) {
      newErrors.password = 'Mật khẩu phải có từ 5 đến 20 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.userType) {
      newErrors.userType = 'Vui lòng chọn vai trò';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        userType: formData.userType // Send as string ("Admin", "Staff", or "Customer")
      };

      console.log('Creating account:', userData);
      await userService.createUser(userData);
      
      alert('Tạo tài khoản thành công!');
      navigate('/accounts');
    } catch (error) {
      console.error('Error creating account:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.')) {
      navigate('/accounts');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/accounts')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <FaArrowLeft className="text-gray-400" size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Thêm tài khoản mới</h1>
          <p className="text-gray-400 text-sm">Điền thông tin để tạo tài khoản mới</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Info Card */}
        <div className="bg-secondary rounded-lg p-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FaUserCircle className="text-accent" />
            Thông tin tài khoản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.username ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="Nhập tên đăng nhập (3-20 ký tự)"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* User Type / Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.userType ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
              >
                <option value="Admin">Quản trị viên</option>
                <option value="Staff">Nhân viên</option>
                <option value="Customer">Khách hàng</option>
              </select>
              {errors.userType && (
                <p className="mt-1 text-sm text-red-400">{errors.userType}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="Nhập mật khẩu (5-20 ký tự)"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FaTimes />
            <span>Hủy</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            <span>{loading ? 'Đang lưu...' : 'Tạo tài khoản'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAccount;
