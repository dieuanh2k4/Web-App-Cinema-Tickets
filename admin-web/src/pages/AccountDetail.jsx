import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserCircle, FaEdit, FaHistory } from 'react-icons/fa';
import { adminAccounts } from '../data/mockData';
import { formatDate } from '../utils/helpers';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find account by id using useMemo
  const account = useMemo(() => {
    const foundAccount = adminAccounts.find(acc => acc.id === parseInt(id));
    if (!foundAccount) {
      alert('Không tìm thấy tài khoản!');
      navigate('/accounts');
      return null;
    }
    return foundAccount;
  }, [id, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: account?.fullName || '',
    email: account?.email || '',
    phone: account?.phone || '',
    role: account?.role || '',
    status: account?.status || ''
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
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

    // Simulate API call
    setTimeout(() => {
      console.log('Updating account:', formData);
      alert('Cập nhật tài khoản thành công!');
      // In a real app, you would update the data in the backend
      // For now, just close edit mode
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role: account.role,
      status: account.status
    });
    setErrors({});
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      manager: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      staff: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return badges[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      manager: 'Quản lý',
      staff: 'Nhân viên'
    };
    return labels[role] || role;
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusLabel = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
  };

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/accounts')}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-400" size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Chi tiết tài khoản</h1>
            <p className="text-gray-400 text-sm">Xem và chỉnh sửa thông tin tài khoản</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaEdit />
            <span>Chỉnh sửa</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Account Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-secondary rounded-lg p-8 border border-gray-700 text-center">
            <div className="mb-6">
              {account.avatar ? (
                <img 
                  src={account.avatar} 
                  alt={account.fullName} 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto bg-accent/20 flex items-center justify-center border-4 border-accent/20">
                  <FaUserCircle className="text-accent" size={64} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{account.fullName}</h2>
            <p className="text-gray-400 mb-4">@{account.username}</p>
            <div className="flex justify-center gap-3 mb-6">
              <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getRoleBadge(account.role)}`}>
                {getRoleLabel(account.role)}
              </span>
              <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusBadge(account.status)}`}>
                {getStatusLabel(account.status)}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-secondary rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaHistory className="text-accent" />
              Thông tin hệ thống
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Ngày tạo:</span>
                <span className="text-white">{formatDate(account.createdDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Đăng nhập lần cuối:</span>
                <span className="text-white">{formatDate(account.lastLogin)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Account Details Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Info Card */}
            <div className="bg-secondary rounded-lg p-8 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaUserCircle className="text-accent" />
                Thông tin cá nhân
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Họ và tên {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.fullName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Số điện thoại {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.phone ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="0901234567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vai trò {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.role ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="manager">Quản lý</option>
                    <option value="staff">Nhân viên</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">{errors.role}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
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
                  <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
