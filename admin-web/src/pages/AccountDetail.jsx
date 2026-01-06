import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserCircle, FaEdit, FaHistory } from 'react-icons/fa';
import userService from '../services/userService';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';

const AccountDetail = () => {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [account, setAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
    address: '',
    role: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch account data from API
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setFetchLoading(true);
        
        // Get userType from navigation state or default to 'admin'
        const userType = location.state?.userType || 'admin';
        
        console.log('🔍 Fetching account:', { id, userType, locationState: location.state });
        const data = await userService.getUserById(parseInt(id), userType);
        console.log('✅ Account data:', data);
        
        // Map backend data to frontend format
        const mappedAccount = {
          id: data.id || data.Id,
          fullName: data.name || data.Name || 'N/A',
          username: data.username || data.userName || data.Username || data.UserName || 'N/A',
          email: data.email || data.Email || 'N/A',
          phone: data.phone || data.Phone || data.phoneNumber || data.PhoneNumber || 'N/A',
          avatar: data.avatar || data.Avatar || null,
          role: userType.toLowerCase(),
          status: 'active',
          createdDate: data.createdDate || data.CreatedDate || new Date().toISOString(),
          lastLogin: data.lastLogin || data.LastLogin || data.createdDate || data.CreatedDate || new Date().toISOString(),
          birth: data.birth || data.Birth || null,
          gender: data.gender || data.Gender || null,
          address: data.address || data.Address || null
        };
        
        setAccount(mappedAccount);
        setFormData({
          fullName: mappedAccount.fullName,
          email: mappedAccount.email,
          phone: mappedAccount.phone,
          birth: mappedAccount.birth || '',
          gender: mappedAccount.gender || '',
          address: mappedAccount.address || '',
          role: mappedAccount.role,
          status: mappedAccount.status
        });
      } catch (error) {
        console.error('❌ Error fetching account:', error);
        alert('Không thể tải thông tin tài khoản!');
        navigate('/accounts');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAccountData();
  }, [id, location.state, navigate]);

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

    try {
      console.log('Updating account:', formData);
      
      // Prepare update data with userType
      const updateData = {
        ...formData,
        Name: formData.fullName,
        Email: formData.email,
        phoneNumber: formData.phone,
        Birth: formData.birth,
        Gender: formData.gender,
        Address: formData.address,
        userType: account.role
      };
      
      // Call API to update user
      await userService.updateUser(account.id, updateData, null);
      
      console.log('\u2705 Account updated successfully');
      alert('C\u1eadp nh\u1eadt t\u00e0i kho\u1ea3n th\u00e0nh c\u00f4ng!');
      
      // Refresh account data
      const userType = location.state?.userType || account.role;
      const updatedData = await userService.getUserById(parseInt(id), userType);
      
      const mappedAccount = {
        id: updatedData.id || updatedData.Id,
        fullName: updatedData.name || updatedData.Name || 'N/A',
        username: updatedData.username || updatedData.userName || updatedData.Username || updatedData.UserName || 'N/A',
        email: updatedData.email || updatedData.Email || 'N/A',
        phone: updatedData.phone || updatedData.Phone || updatedData.phoneNumber || updatedData.PhoneNumber || 'N/A',
        avatar: updatedData.avatar || updatedData.Avatar || null,
        role: userType.toLowerCase(),
        status: 'active',
        createdDate: updatedData.createdDate || updatedData.CreatedDate || new Date().toISOString(),
        lastLogin: updatedData.lastLogin || updatedData.LastLogin || updatedData.createdDate || updatedData.CreatedDate || new Date().toISOString(),
        birth: updatedData.birth || updatedData.Birth || null,
        gender: updatedData.gender || updatedData.Gender || null,
        address: updatedData.address || updatedData.Address || null
      };
      
      setAccount(mappedAccount);
      setIsEditing(false);
    } catch (error) {
      console.error('\u274c Error updating account:', error);
      alert('C\u1eadp nh\u1eadt th\u1ea5t b\u1ea1i: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      birth: account.birth || '',
      gender: account.gender || '',
      address: account.address || '',
      role: account.role,
      status: account.status
    });
    setErrors({});
    setIsEditing(false);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      staff: 'bg-green-500/20 text-green-400 border-green-500/30',
      customer: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return badges[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      customer: 'Khách hàng'
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

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Không tìm thấy tài khoản</div>
      </div>
    );
  }

  // Check if user is Admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-400">Chỉ Admin mới có quyền quản lý tài khoản</p>
        </div>
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
            <h2 className="text-2xl font-bold text-white mb-4">{account.fullName}</h2>
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

                {/* Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birth"
                    value={formData.birth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nhập địa chỉ"
                  />
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
                    <option value="staff">Nhân viên</option>
                    <option value="customer">Khách hàng</option>
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
