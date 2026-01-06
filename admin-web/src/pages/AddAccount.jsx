import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserCircle, FaImage } from 'react-icons/fa';
import userService from '../services/userService';

const AddAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    Name: '',
    email: '',
    phoneNumber: '',
    Birth: '',
    Gender: 'Nam',
    Address: '',
    role: 'staff'
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Vui lòng chọn file ảnh' }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Kích thước ảnh không được vượt quá 5MB' }));
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 4 ký tự';
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.Name.trim()) {
      newErrors.Name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    }

    if (!formData.Birth) {
      newErrors.Birth = 'Vui lòng chọn ngày sinh';
    } else {
      const birthDate = new Date(formData.Birth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.Birth = 'Tuổi phải từ 18 trở lên';
      }
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Vui lòng chọn giới tính';
    }

    if (!formData.Address.trim()) {
      newErrors.Address = 'Vui lòng nhập địa chỉ';
    }

    if (!formData.role) {
      newErrors.role = 'Vui lòng chọn vai trò';
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
      // Prepare data for API
      // Map field names to match Backend DTO (CreateAdminDto/CreateStaffDto)
      const userData = {
        username: formData.username,
        password: formData.password,
        Name: formData.Name,
        Email: formData.email, // Backend DTO uses uppercase Email
        phoneNumber: formData.phoneNumber,
        Birth: formData.Birth, // Backend expects DateOnly format
        Gender: formData.Gender,
        Address: formData.Address,
        userType: formData.role // Map role → userType for routing
      };

      console.log('Creating user with data:', userData);
      console.log('Avatar file:', avatarFile);

      // Call API through userService (handles role routing automatically)
      await userService.createUser(userData, avatarFile);

      alert('Tạo tài khoản thành công!');
      navigate('/accounts');
    } catch (error) {
      console.error('Error creating account:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo tài khoản';
      alert(`Không thể tạo tài khoản: ${errorMessage}`);
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
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>

            {/* Name (Họ và tên) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.Name ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="Nhập họ và tên"
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-400">{errors.Name}</p>
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
                placeholder="Nhập mật khẩu"
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

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="0901234567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="Birth"
                value={formData.Birth}
                onChange={handleChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.Birth ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
              />
              {errors.Birth && (
                <p className="mt-1 text-sm text-red-400">{errors.Birth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.Gender ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.Gender && (
                <p className="mt-1 text-sm text-red-400">{errors.Gender}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Address"
                value={formData.Address}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.Address ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
                placeholder="Nhập địa chỉ"
              />
              {errors.Address && (
                <p className="mt-1 text-sm text-red-400">{errors.Address}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-primary border ${
                  errors.role ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:outline-none focus:border-accent`}
              >
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
                <option value="customer">Khách hàng</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-primary border ${
                    errors.avatar ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-gray-400 hover:border-accent transition-colors`}>
                    <FaImage />
                    <span>{avatarFile ? avatarFile.name : 'Chọn ảnh'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-600"
                  />
                )}
              </div>
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-400">{errors.avatar}</p>
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
