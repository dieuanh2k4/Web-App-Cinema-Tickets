import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiCheck } from 'react-icons/fi'
import { sendOTP, verifyOTP, resetPassword } from '../services/api'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('newPassword')

  // Step 1: Send OTP
  const sendOTPMutation = useMutation({
    mutationFn: sendOTP,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success('Mã OTP đã được gửi đến email của bạn!')
        setStep(2)
      } else {
        toast.error(data.message || 'Gửi OTP thất bại')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Email không tồn tại trong hệ thống')
    }
  })

  // Step 2: Verify OTP
  const verifyOTPMutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success('Xác thực OTP thành công!')
        setStep(3)
      } else {
        toast.error(data.message || 'Mã OTP không chính xác')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn')
    }
  })

  // Step 3: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập.')
        window.location.href = '/login'
      } else {
        toast.error(data.message || 'Đổi mật khẩu thất bại')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại')
    }
  })

  const handleSendOTP = (data) => {
    setEmail(data.email)
    sendOTPMutation.mutate({ email: data.email })
  }

  const handleVerifyOTP = (data) => {
    setOtp(data.otp)
    verifyOTPMutation.mutate({ email, otp: data.otp })
  }

  const handleResetPassword = (data) => {
    resetPasswordMutation.mutate({
      email,
      otp,
      newPassword: data.newPassword
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-4xl font-bold">
              CINE<span className="text-purple">BOOK</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold">Quên mật khẩu</h2>
          <p className="mt-2 text-gray-400">
            {step === 1 && 'Nhập email để nhận mã xác thực'}
            {step === 2 && 'Nhập mã OTP đã được gửi đến email'}
            {step === 3 && 'Nhập mật khẩu mới của bạn'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-purple' : 'bg-gray-custom'
            }`}>
              {step > 1 ? <FiCheck /> : '1'}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple' : 'bg-gray-custom'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-purple' : 'bg-gray-custom'
            }`}>
              {step > 2 ? <FiCheck /> : '2'}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-purple' : 'bg-gray-custom'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-purple' : 'bg-gray-custom'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                  placeholder="Nhập email của bạn"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sendOTPMutation.isPending}
              className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 disabled:opacity-50"
            >
              {sendOTPMutation.isPending ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-gray-400 hover:text-white">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                Mã OTP
              </label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                {...register('otp', {
                  required: 'Vui lòng nhập mã OTP',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Mã OTP phải có 6 chữ số'
                  }
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white text-center text-2xl tracking-widest placeholder-gray-500"
                placeholder="000000"
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
              )}
              <p className="mt-2 text-xs text-gray-400 text-center">
                Mã OTP đã được gửi đến <span className="text-purple font-semibold">{email}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={verifyOTPMutation.isPending}
              className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 disabled:opacity-50"
            >
              {verifyOTPMutation.isPending ? 'Đang xác thực...' : 'Xác thực'}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => sendOTPMutation.mutate({ email })}
                disabled={sendOTPMutation.isPending}
                className="text-purple hover:text-purple-light"
              >
                Gửi lại mã
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="newPassword"
                  type="password"
                  {...register('newPassword', {
                    required: 'Vui lòng nhập mật khẩu mới',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value => value === password || 'Mật khẩu không khớp'
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 disabled:opacity-50"
            >
              {resetPasswordMutation.isPending ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
