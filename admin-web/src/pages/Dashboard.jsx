import { useState } from 'react';
import { FaMoneyBillWave, FaTicketAlt, FaDollarSign, FaUserPlus, FaSyncAlt } from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardStats, movies } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

// StatCard Component
function StatCard({ icon: IconComponent, title, value, gradient }) {
  return (
    <div className="bg-gradient-to-br from-secondary via-secondary to-secondary/50 rounded-2xl p-8 border border-gray-700/50 hover:border-accent/50 transition-all hover:shadow-xl hover:shadow-accent/10 group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
        </div>
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          {IconComponent && <IconComponent className="text-white" size={26} />}
        </div>
      </div>
    </div>
  );
}

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary border border-gray-700 rounded-lg p-4 shadow-lg">
        <p className="text-white font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm mt-1" style={{ color: entry.color }}>
            {entry.name}: {entry.name.includes('Doanh thu') ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const Dashboard = () => {
  const stats = dashboardStats;
  const [dateRange, setDateRange] = useState({
    start: '2024-04-01',
    end: '2024-04-15'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: Load data from DB
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Data refreshed');
    }, 1000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-gray-400 text-sm lg:text-base">Tổng quan hệ thống rạp chiếu phim</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent text-sm"
          />
          <span className="text-gray-400 flex items-center px-2">đến</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-2.5 bg-secondary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent text-sm"
          />
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          icon={FaMoneyBillWave}
          title="Doanh thu trong ngày (15/5/2024)"
          value={formatCurrency(stats.todayRevenue)}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={FaUserPlus}
          title="Khách hàng mới (T5/2024)"
          value={stats.newCustomers}
          gradient="from-green-500 to-emerald-600"
        />
        <StatCard
          icon={FaTicketAlt}
          title="Tổng vé bán ra (T5/2024)"
          value={stats.totalTicketsSold}
          gradient="from-orange-500 to-amber-600"
        />
        <StatCard
          icon={FaDollarSign}
          title="Tổng doanh thu (T5/2024)"
          value={formatCurrency(stats.totalRevenue)}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Top Movies Bar Chart */}
        <div className="bg-secondary rounded-lg p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Top bài viết dược xem nhiều nhất</h2>
            <span className="text-sm text-gray-400">Lượt xem</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.topMovies}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="title" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="ticketsSold" fill="#60a5fa" name="Số vé bán ra" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Line Chart */}
        <div className="bg-secondary rounded-lg p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Doanh thu theo tháng</h2>
            <span className="text-sm text-gray-400">Doanh thu</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} name="Doanh thu" dot={{ fill: '#ec4899', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue by Movie Table */}
      <div className="bg-secondary rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Doanh thu theo phim</h2>
          <a href="#" className="text-accent hover:text-accent/80 text-sm">Xem tất cả →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tên phim</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Tổng vé bán ra</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Tổng doanh thu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stats.topMovies.map((movie) => (
                <tr key={movie.movieId} className="hover:bg-primary/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-8 bg-gray-700 rounded"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{movie.title}</div>
                        <div className="text-sm text-gray-400">
                          {movies.find(m => m.id === movie.movieId)?.director}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-white">{movie.ticketsSold}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-white">{formatCurrency(movie.revenue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-center">
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-accent text-white rounded">1</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
