import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiCalendar, FiLogOut, FiCreditCard, FiSettings } from 'react-icons/fi'
import { getUserProfile, getUserTickets } from '../services/api'
import { useAuthStore } from '../store/authStore'
import TicketCard from '../components/TicketCard'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('tickets')

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const { data: tickets, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['user-tickets'],
    queryFn: getUserTickets,
    enabled: !!user && activeTab === 'tickets',
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  // Filter tickets
  const paidTickets = tickets?.filter(t => 
    t.status?.toLowerCase() === 'confirmed' || t.status?.toLowerCase() === 'paid'
  ) || []
  const cancelledTickets = tickets?.filter(t => 
    t.status?.toLowerCase() === 'cancelled'
  ) || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
          <p className="text-gray-400">Quản lý thông tin cá nhân và lịch sử đặt vé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-light rounded-xl p-6 border border-gray-custom sticky top-24">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiUser size={40} className="text-purple" />
                </div>
                <h3 className="text-xl font-bold text-white">{profile?.username}</h3>
                <p className="text-sm text-gray-400">{profile?.email}</p>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-purple text-white'
                      : 'text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  <FiCreditCard size={20} />
                  <span className="font-semibold">Vé của tôi</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'profile'
                      ? 'bg-purple text-white'
                      : 'text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  <FiSettings size={20} />
                  <span className="font-semibold">Thông tin cá nhân</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiLogOut size={20} />
                  <span className="font-semibold">Đăng xuất</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                {/* Tabs for ticket status */}
                <div className="bg-dark-light rounded-xl p-1 inline-flex space-x-1">
                  <button
                    onClick={() => setActiveTab('tickets')}
                    className="px-6 py-2 rounded-lg bg-purple text-white font-semibold transition-all"
                  >
                    Tất cả ({tickets?.length || 0})
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-all"
                  >
                    Đã thanh toán ({paidTickets.length})
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-all"
                  >
                    Đã hủy ({cancelledTickets.length})
                  </button>
                </div>

                {/* Tickets List */}
                {isLoadingTickets ? (
                  <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : !tickets || tickets.length === 0 ? (
                  <div className="bg-dark-light rounded-xl p-12 text-center border border-gray-custom">
                    <div className="w-20 h-20 bg-gray-custom/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCreditCard size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Chưa có vé nào</h3>
                    <p className="text-gray-400 mb-6">Bạn chưa đặt vé xem phim nào</p>
                    <button
                      onClick={() => navigate('/movies')}
                      className="bg-purple hover:bg-purple-dark text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      Đặt vé ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <TicketCard key={ticket.ticketId} ticket={ticket} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-dark-light rounded-xl p-6 border border-gray-custom">
                <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser size={16} />
                        <span>Tên đăng nhập</span>
                      </label>
                      <input
                        type="text"
                        value={profile?.username || ''}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiMail size={16} />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiPhone size={16} />
                        <span>Số điện thoại</span>
                      </label>
                      <input
                        type="tel"
                        value={profile?.phoneNumber || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiCalendar size={16} />
                        <span>Ngày tạo tài khoản</span>
                      </label>
                      <input
                        type="text"
                        value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-custom/30">
                    <div className="bg-purple/10 border border-purple/30 rounded-lg p-4">
                      <p className="text-sm text-gray-300">
                        <strong className="text-purple">Lưu ý:</strong> Để thay đổi thông tin cá nhân, vui lòng liên hệ với bộ phận hỗ trợ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
