import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaUserCircle, FaEdit } from 'react-icons/fa';
import userService from '../services/userService';
import { formatDate } from '../utils/helpers';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [account, setAccount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    userType: 'Staff' // Default to Staff (string)
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load account from API
  useEffect(() => {
    loadAccount();
  }, [id]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      // BE doesn't have getUserById, so we get all and filter
      const users = await userService.getAllUsers();
      const foundAccount = users.find(acc => acc.id === parseInt(id));
      
      if (!foundAccount) {
        alert('Không tìm thấy tài khoản!');
        navigate('/accounts');
        return;
      }
      
      setAccount(foundAccount);
      setFormData({
        username: foundAccount.username || '',
        userType: getUserTypeString(foundAccount.userType)
      });
    } catch (error) {
      console.error('Error loading account:', error);
      alert('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
      navigate('/accounts');
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.username || !formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const userData = {
        username: formData.username,
        userType: formData.userType // Send as string ("Admin" or "Staff")
      };

      console.log('Updating account:', userData);
      await userService.updateUser(account.id, userData);
      
      alert('Cập nhật tài khoản thành công!');
      setIsEditing(false);
      await loadAccount(); // Reload to get updated data
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Không thể cập nhật tài khoản. Vui lòng thử lại sau.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: account.username,
      userType: getUserTypeString(account.userType)
    });
    setErrors({});
    setIsEditing(false);
  };

  // Helper to convert userType int to string
  const getUserTypeString = (userType) => {
    // BE DB: 0 = Admin, 1 = Staff, 2 = Customer, but API expects string
    const types = {
      0: 'Admin',
      1: 'Staff',
      2: 'Customer'
    };
    return types[userType] || 'Staff';
  };

  const getUserRole = (userType) => {
    // If already string, return lowercase
    if (typeof userType === 'string') {
      return userType.toLowerCase();
    }
    // Convert int to string then lowercase
    return getUserTypeString(userType).toLowerCase();
  };

  const getRoleBadge = (userType) => {
    const role = getUserRole(userType);
    const badges = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      staff: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return badges[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleLabel = (userType) => {
    const role = getUserRole(userType);
    const labels = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên'
    };
    return labels[role] || role;
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
              <div className="w-32 h-32 rounded-full mx-auto bg-accent/20 flex items-center justify-center border-4 border-accent/20">
                <FaUserCircle className="text-accent" size={64} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">@{account.username}</h2>
            <p className="text-gray-400 mb-4">ID: {account.id}</p>
            <div className="flex justify-center gap-3 mb-6">
              <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getRoleBadge(account.userType)}`}>
                {getRoleLabel(account.userType)}
              </span>
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
                Thông tin tài khoản
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tên đăng nhập {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.username ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Nhập tên đăng nhập"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                  )}
                </div>

                {/* User Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vai trò {isEditing && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 bg-primary border ${
                      errors.userType ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="Admin">Quản trị viên</option>
                    <option value="Staff">Nhân viên</option>
                    <option value="Customer">Khách hàng</option>
                  </select>
                  {errors.userType && (
                    <p className="mt-1 text-sm text-red-400">{errors.userType}</p>
                  )}
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
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
