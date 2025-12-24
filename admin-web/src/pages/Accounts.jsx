import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaSearch, FaEye, FaUserCircle, FaSyncAlt } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import userService from '../services/userService';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 10;

  // Load accounts from API
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      alert('Không thể tải danh sách tài khoản. Vui lòng thử lại sau.');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAccounts();
    setIsRefreshing(false);
  };

  // Helper to convert userType number to role text
  const getUserRole = (userType) => {
    // BE: 0 = Admin, 1 = Staff, 2 = Customer
    const roles = {
      0: 'admin',
      1: 'staff'
    };
    return roles[userType] || 'unknown';
  };

  // Get unique roles for filter
  const roles = [...new Set(accounts.map(a => getUserRole(a.userType)))].filter(r => r !== 'unknown').sort();

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const role = getUserRole(account.userType);
    const matchSearch = (account.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchRole = !filterRole || role === filterRole;
    
    return matchSearch && matchRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await userService.deleteUser(id);
        await loadAccounts();
        alert('Xóa tài khoản thành công!');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Không thể xóa tài khoản. Vui lòng thử lại sau.');
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setCurrentPage(1);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      staff: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return badges[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên'
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải dữ liệu...</p>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo username..."
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
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Hiển thị <span className="text-white font-medium">{currentAccounts.length}</span> trong tổng số{' '}
            <span className="text-white font-medium">{filteredAccounts.length}</span> tài khoản
          </p>
          {(searchTerm || filterRole) && (
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tài khoản</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentAccounts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    Không có tài khoản nào
                  </td>
                </tr>
              ) : (
                currentAccounts.map((account) => {
                  const role = getUserRole(account.userType);
                  return (
                    <tr key={account.id} className="hover:bg-primary/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                              <FaUserCircle className="text-accent" size={24} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{account.username || 'N/A'}</div>
                            <div className="text-sm text-gray-400">ID: {account.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadge(role)}`}>
                          {getRoleLabel(role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">Type: {account.userType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/accounts/${account.id}`}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
