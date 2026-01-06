import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiCalendar, FiLogOut, FiCreditCard, FiSettings, FiCheck, FiX } from 'react-icons/fi'
import { getUserTickets, getCurrentUser, getCustomerByUserId } from '../services/api'
import { useAuthStore } from '../store/authStore'
import TicketCard from '../components/TicketCard'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('tickets')
  const [ticketFilter, setTicketFilter] = useState('all')
  const hasFetchedRef = useRef(false) // Track if we've already fetched

  // Auto-fetch customer info if user data is incomplete (only once)
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      // Only fetch if: user exists, missing email, and haven't fetched yet
      if (user && !user.email && !hasFetchedRef.current) {
        hasFetchedRef.current = true // Mark as fetching to prevent duplicates
        console.log('⚠️ User info incomplete, fetching customer data...')
        
        try {
          // Get userId from /Auth/me
          const meData = await getCurrentUser()
          const userId = meData.userId
          
          if (userId) {
            console.log(`📡 Fetching customer by userId: ${userId}`)
            const customerInfo = await getCustomerByUserId(userId)
            console.log('✅ Customer info RAW response:', customerInfo)
            console.log('📋 Customer info fields (lowercase):', {
              id: customerInfo?.id,
              name: customerInfo?.name,
              email: customerInfo?.email,
              phone: customerInfo?.phone,
              birth: customerInfo?.birth,
              gender: customerInfo?.gender,
              address: customerInfo?.address
            })
            console.log('📋 Customer info fields (UPPERCASE):', {
              Id: customerInfo?.Id,
              Name: customerInfo?.Name,
              Email: customerInfo?.Email,
              Phone: customerInfo?.Phone,
              Birth: customerInfo?.Birth,
              gender: customerInfo?.gender,
              Address: customerInfo?.Address
            })
            
            // Backend returns uppercase fields: Id, Name, Email, Phone, Birth, Address
            // But gender is lowercase
            const fullUserInfo = {
              id: customerInfo?.Id || customerInfo?.id || user.id,
              name: customerInfo?.Name || customerInfo?.name || user.name,
              email: customerInfo?.Email || customerInfo?.email || '',
              phoneNumber: customerInfo?.Phone || customerInfo?.phone || '',
              birth: customerInfo?.Birth || customerInfo?.birth || null,
              gender: customerInfo?.gender || customerInfo?.Gender || '',
              address: customerInfo?.Address || customerInfo?.address || '',
              avatar: customerInfo?.Avatar || customerInfo?.avatar || user.avatar,
              username: user.username,
              role: user.role,
              userId: userId
            }
            
            console.log('💾 Updating authStore with:', fullUserInfo)
            updateUser(fullUserInfo)
            console.log('✅ AuthStore updated successfully')
            toast.success('Đã tải thông tin cá nhân')
          }
        } catch (error) {
          console.error('❌ Failed to fetch customer info:', error)
          toast.error('Không thể tải thông tin. Vui lòng đăng xuất và đăng nhập lại')
          hasFetchedRef.current = false // Reset on error to allow retry
        }
      }
    }
    
    fetchCustomerInfo()
  }, [user?.username]) // Only depend on username (stable identifier)

  // Use user from authStore (already has full info after login)
  const displayProfile = user

  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ['user-tickets', user?.email],
    queryFn: () => getUserTickets(user?.email),
    enabled: !!user?.email && activeTab === 'tickets',
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // Extract tickets from response
  const tickets = ticketsResponse?.data || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  // Filter tickets
  const paidTickets = tickets?.filter(t => 
    t.paymentStatus?.toLowerCase() === 'đã thanh toán' ||
    t.PaymentStatus?.toLowerCase() === 'đã thanh toán' ||
    t.status?.toLowerCase() === 'confirmed' || 
    t.status?.toLowerCase() === 'paid' ||
    t.payment?.status?.toLowerCase() === 'đã thanh toán'
  ) || []
  const cancelledTickets = tickets?.filter(t => 
    t.paymentStatus?.toLowerCase() === 'thanh toán thất bại' ||
    t.PaymentStatus?.toLowerCase() === 'thanh toán thất bại' ||
    t.paymentStatus?.toLowerCase() === 'đã hủy' ||
    t.PaymentStatus?.toLowerCase() === 'đã hủy' ||
    t.status?.toLowerCase() === 'cancelled' ||
    t.payment?.status?.toLowerCase() === 'thanh toán thất bại' ||
    t.payment?.status?.toLowerCase() === 'đã hủy'
  ) || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
          <p className="text-gray-400">Quản lý thông tin cá nhân và lịch sử đặt vé</p>
          
          {/* Ticket Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-dark-light rounded-xl p-4 hover:bg-dark-lighter transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Tổng số vé</p>
                  <p className="text-white text-2xl font-bold mt-1">{tickets?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple/20 rounded-full flex items-center justify-center">
                  <FiCreditCard size={24} className="text-purple" />
                </div>
              </div>
            </div>
            
            <div className="bg-dark-light rounded-xl p-4 hover:bg-dark-lighter transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Đã thanh toán</p>
                  <p className="text-green-400 text-2xl font-bold mt-1">{paidTickets.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <FiCheck size={24} className="text-green-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-dark-light rounded-xl p-4 hover:bg-dark-lighter transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Đã hủy</p>
                  <p className="text-red-400 text-2xl font-bold mt-1">{cancelledTickets.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <FiX size={24} className="text-red-400" />
                </div>
              </div>
            </div>
          </div>
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
                <h3 className="text-xl font-bold text-white">{displayProfile?.username || displayProfile?.name}</h3>
                <p className="text-sm text-gray-400">{displayProfile?.email}</p>
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
                    {/* Show all tickets */}
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
                    {/* Username */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser size={16} />
                        <span>Tên đăng nhập</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.username || ''}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser size={16} />
                        <span>Họ và tên</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.name || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiMail size={16} />
                        <span>Email</span>
                      </label>
                      <input
                        type="email"
                        value={displayProfile?.email || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiPhone size={16} />
                        <span>Số điện thoại</span>
                      </label>
                      <input
                        type="tel"
                        value={displayProfile?.phoneNumber || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Birth Date */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiCalendar size={16} />
                        <span>Ngày sinh</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.birth ? new Date(displayProfile.birth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser size={16} />
                        <span>Giới tính</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.gender || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiUser size={16} />
                        <span>Địa chỉ</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.address || 'Chưa cập nhật'}
                        disabled
                        className="w-full px-4 py-3 bg-dark border border-gray-custom rounded-lg text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Created Date */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                        <FiCalendar size={16} />
                        <span>Ngày tạo tài khoản</span>
                      </label>
                      <input
                        type="text"
                        value={displayProfile?.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
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
