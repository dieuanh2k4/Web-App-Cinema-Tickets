import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaSearch, FaEye, FaUserCircle, FaSyncAlt } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import userService from '../services/userService';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting to load accounts...');
      const data = await userService.getAllUsers();
      console.log('✅ Received data:', data);
      
      // Map Backend data to Frontend format
      const mappedData = data.map((user, index) => {
        console.log('Raw user data:', user);
        return {
          id: user.id || user.Id,
          uniqueKey: `${user.userType}-${user.id || user.Id}-${index}`, // Unique key for React
          username: user.username || user.userName || user.Username || user.UserName || 'N/A',
          fullName: user.name || user.Name || user.fullName || user.FullName || 'N/A',
          email: user.email || user.Email || 'N/A',
          phoneNumber: user.phone || user.Phone || user.phoneNumber || user.PhoneNumber || 'N/A',
          avatar: user.avatar || user.Avatar || null,
          role: user.userType?.toLowerCase() || 'staff',
          status: 'active',
          createdDate: user.createdDate || user.CreatedDate || new Date().toISOString()
        };
      });
      
      console.log('✅ Mapped data:', mappedData);
      setAccounts(mappedData);
    } catch (error) {
      console.error('❌ Error loading accounts:', error);
      console.error('❌ Error response:', error.response);
      alert(`Không thể tải danh sách tài khoản: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  // Get unique roles for filter
  const roles = [...new Set(accounts.map(a => a.role))].sort();

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const matchSearch = account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !filterRole || account.role === filterRole;
    const matchStatus = !filterStatus || account.status === filterStatus;
    
    return matchSearch && matchRole && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id, userType) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await userService.deleteUser(id, userType);
        alert('Xóa tài khoản thành công!');
        await loadData(); // Reload data
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Không thể xóa tài khoản. Vui lòng thử lại!');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
    setCurrentPage(1);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Quản lý tài khoản</h1>
          <p className="text-gray-400 text-sm lg:text-base">Danh sách tất cả tài khoản trong hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <Link
            to="/accounts/add"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaPlus />
            <span>Thêm tài khoản</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-secondary rounded-lg p-8 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, username, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-primary border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">Tất cả vai trò</option>
              {roles.map(role => (
                <option key={role} value={role}>{getRoleLabel(role)}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Hiển thị <span className="text-white font-medium">{currentAccounts.length}</span> trong tổng số{' '}
            <span className="text-white font-medium">{filteredAccounts.length}</span> tài khoản
          </p>
          {(searchTerm || filterRole || filterStatus) && (
            <button
              onClick={handleResetFilters}
              className="text-sm text-accent hover:text-accent/80 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentAccounts.map((account) => (
                <tr key={account.uniqueKey || `${account.role}-${account.id}`} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {account.avatar ? (
                          <img src={account.avatar} alt="User avatar" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <FaUserCircle className="text-accent" size={20} />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{account.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadge(account.role)}`}>
                      {getRoleLabel(account.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{account.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{account.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(account.status)}`}>
                      {getStatusLabel(account.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatDate(account.createdDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/accounts/${account.id}`}
                        state={{ userType: account.role }}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(account.id, account.role)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex justify-center">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? 'bg-accent text-white'
                      : 'bg-primary text-gray-400 hover:bg-primary/70'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="bg-secondary rounded-lg p-12 text-center border border-gray-700">
          <FaUserCircle className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">Không tìm thấy tài khoản</h3>
          <p className="text-gray-400 mb-6">Không có tài khoản nào phù hợp với bộ lọc hiện tại</p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default Accounts;
