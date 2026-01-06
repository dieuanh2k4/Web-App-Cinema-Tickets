import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { login } from '../services/api'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm()

  // Lấy trang người dùng định vào trước khi bị redirect
  const from = location.state?.from || '/'

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log('Login Response Full Data:', data);
      
      if (data.isSuccess || data.token) {
        const userData = {
          username: data.username || data.data?.username,
          role: data.role || data.data?.role,
          userId: data.userId || data.data?.userId,
          customerId: data.customerId || data.data?.customerId, // Thêm customerId
        };
        const token = data.token || data.data?.token;
        
        console.log('Extracted userData:', userData);
        
        // Debug: Log JWT token structure
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const decoded = JSON.parse(atob(base64));
              console.log('JWT Token Payload:', decoded);
            }
          } catch (e) {
            console.log('Could not decode token:', e);
          }
        }
        
        setAuth(userData, token);
        toast.success('Đăng nhập thành công!')
        // Redirect về trang người dùng định vào
        navigate(from, { replace: true })
      } else {
        toast.error(data.message || 'Đăng nhập thất bại')
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                          error.message ||
                          'Đăng nhập thất bại'
      toast.error(errorMessage)
    }
  })

  const onSubmit = (data) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark-light to-purple/10 py-12 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-light rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold">
              CINE<span className="text-purple">BOOK</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Đăng nhập</h2>
          <p className="mt-2 text-gray-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-purple hover:text-purple-light">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-gray-custom bg-dark-light text-purple focus:ring-purple/50"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-purple hover:text-purple-light">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}
