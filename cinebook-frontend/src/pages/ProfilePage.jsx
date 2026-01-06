import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiEdit2,
  FiSave,
  FiX,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiLogOut,
} from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { getCustomerInfo, updateCustomerInfo } from '../services/api';

// Decode JWT token
const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to decode JWT', e);
    return null;
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info'); // 'tickets' or 'info'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Get userId from JWT token
  const userId = useMemo(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = decodeJWT(token);
    if (!decoded) return null;
    
    console.log('JWT Decoded:', decoded);
    
    // Try different claim names
    const id = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
               decoded.sub ||
               decoded.nameid ||
               decoded.userId;
    
    console.log('Extracted userId:', id);
    return id ? parseInt(id) : null;
  }, []);

  // Fetch customer info by userId
  const { data: customerInfo, isLoading, error, refetch } = useQuery({
    queryKey: ['customer-info-by-user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No userId found');
      
      console.log('Fetching customer info for userId:', userId);
      // Tạm thời dùng customerId = userId vì server chưa có endpoint get-by-userId
      try {
        const data = await getCustomerInfo(userId);
        console.log('Customer Info Response:', data);
        return data;
      } catch (err) {
        console.error('Get Customer Info Error:', err);
        throw err;
      }
    },
    enabled: !!userId,
    retry: false,
  });

  // Mock ticket stats (sẽ thay bằng API thực)
  const ticketStats = {
    total: 0,
    paid: 0,
    cancelled: 0,
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({});
      setIsEditing(false);
    } else {
      setFormData({
        name: customerInfo?.name || '',
        email: customerInfo?.email || '',
        phone: customerInfo?.phone || '',
        birth: customerInfo?.birth || '',
        gender: customerInfo?.gender || '',
        address: customerInfo?.address || '',
      });
      setIsEditing(true);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data) => updateCustomerInfo(userId, data),
    onSuccess: () => {
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    },
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Đã đăng xuất');
  };

  if (!user || !userId) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !customerInfo) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center max-w-md">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy thông tin</h2>
          <p className="text-gray-400 mb-6">
            Không thể tải thông tin tài khoản. Vui lòng thử lại sau.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-purple hover:bg-purple-light rounded-lg transition-colors"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-light to-purple/10 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tài khoản của tôi</h1>
          <p className="text-gray-400">Quản lý thông tin cá nhân và lịch sử đặt vé</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-light border border-gray-custom rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Tổng số vé</p>
                <p className="text-3xl font-bold text-white">{ticketStats.total}</p>
              </div>
              <div className="w-14 h-14 bg-purple/20 rounded-lg flex items-center justify-center">
                <FiCreditCard className="w-7 h-7 text-purple" />
              </div>
            </div>
          </div>

          <div className="bg-dark-light border border-gray-custom rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Đã thanh toán</p>
                <p className="text-3xl font-bold text-green-400">{ticketStats.paid}</p>
              </div>
              <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-7 h-7 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-dark-light border border-gray-custom rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Đã hủy</p>
                <p className="text-3xl font-bold text-red-400">{ticketStats.cancelled}</p>
              </div>
              <div className="w-14 h-14 bg-red-500/20 rounded-lg flex items-center justify-center">
                <FiXCircle className="w-7 h-7 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light border border-gray-custom rounded-xl p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-purple/20 rounded-full flex items-center justify-center mb-3">
                  {customerInfo.avatar ? (
                    <img
                      src={customerInfo.avatar}
                      alt={customerInfo.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-12 h-12 text-purple" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{customerInfo.name || 'N/A'}</h3>
                <p className="text-gray-400 text-sm">{customerInfo.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'info'
                      ? 'bg-purple text-white'
                      : 'text-gray-400 hover:bg-purple/10 hover:text-white'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">Thông tin cá nhân</span>
                </button>

                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'tickets'
                      ? 'bg-purple text-white'
                      : 'text-gray-400 hover:bg-purple/10 hover:text-white'
                  }`}
                >
                  <FiCreditCard className="w-5 h-5" />
                  <span className="font-medium">Vé của tôi</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-red-400 hover:bg-red-500/10"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-dark-light border border-gray-custom rounded-xl p-8">
              {activeTab === 'tickets' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Vé của tôi</h2>
                  <div className="text-center py-12">
                    <FiCreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Chưa có vé nào</p>
                    <button
                      onClick={() => navigate('/movies')}
                      className="mt-4 px-6 py-2 bg-purple hover:bg-purple-light rounded-lg transition-colors"
                    >
                      Đặt vé ngay
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple hover:bg-purple-light rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={updateMutation.isLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <FiSave className="w-4 h-4" />
                          <span>Lưu</span>
                        </button>
                        <button
                          onClick={handleEditToggle}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Hủy</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên đăng nhập */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser className="w-4 h-4" />
                        <span>Tên đăng nhập</span>
                      </label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Họ và tên */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser className="w-4 h-4" />
                        <span>Họ và tên</span>
                      </label>
                      <input
                        type="text"
                        value={isEditing ? formData.name : customerInfo.name || 'Chưa cập nhật'}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiMail className="w-4 h-4" />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        value={isEditing ? formData.email : customerInfo.email || 'Chưa cập nhật'}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiPhone className="w-4 h-4" />
                        <span>Số điện thoại</span>
                      </label>
                      <input
                        type="tel"
                        value={isEditing ? formData.phone : customerInfo.phone || 'Chưa cập nhật'}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>Ngày sinh</span>
                      </label>
                      <input
                        type="date"
                        value={isEditing ? formData.birth : customerInfo.birth || ''}
                        onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser className="w-4 h-4" />
                        <span>Giới tính</span>
                      </label>
                      <select
                        value={isEditing ? formData.gender : customerInfo.gender || ''}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="">Chưa cập nhật</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    {/* Địa chỉ */}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>Địa chỉ</span>
                      </label>
                      <input
                        type="text"
                        value={isEditing ? formData.address : customerInfo.address || 'Chưa cập nhật'}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple/50 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>

                    {/* Ngày tạo tài khoản */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>Ngày tạo tài khoản</span>
                      </label>
                      <input
                        type="text"
                        value={customerInfo.createdDate || 'N/A'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mt-8 p-4 bg-purple/10 border border-purple/30 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <span className="text-purple font-semibold">Lưu ý:</span> Để thay đổi thông tin cá nhân, vui lòng liên hệ với bộ phận hỗ trợ.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
