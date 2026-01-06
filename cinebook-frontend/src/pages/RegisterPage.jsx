import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  FiEye,
  FiEyeOff,
  FiFilm,
  FiCreditCard,
  FiMonitor,
} from 'react-icons/fi';
import { register as registerUser } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch('password');

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      // Auto redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Đăng ký thất bại';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data) => {
    // Validate birth date
    if (!data.birth) {
      toast.error('Vui lòng nhập ngày sinh');
      return;
    }

    registerMutation.mutate({
      name: data.fullName || '',
      username: data.username,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber || '',
      gender: data.gender || '',
      birth: data.birth,
      address: data.address || '',
      imageFile: data.imageFile?.[0] || null,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background with movies */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple/20 via-dark to-dark"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-40 pl-80 text-center h-full">
          <div className="mb-auto"></div>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-5xl font-bold mb-4">
              CINE<span className="text-purple">BOOK</span>
            </h1>
          </Link>
          <p className="text-xl text-gray-300 mb-12">
            Trải nghiệm đặt vé xem phim dễ dàng
          </p>
          <div className="flex space-x-4 mb-auto">
            <div className="w-16 h-16 bg-purple/30 rounded-lg flex items-center justify-center">
              <FiFilm className="text-purple text-3xl" />
            </div>
            <div className="w-16 h-16 bg-purple/30 rounded-lg flex items-center justify-center">
              <FiCreditCard className="text-purple text-3xl" />
            </div>
            <div className="w-16 h-16 bg-purple/30 rounded-lg flex items-center justify-center">
              <FiMonitor className="text-purple text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold">
                CINE<span className="text-purple">BOOK</span>
              </h1>
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-center lg:text-left">
              Tạo tài khoản
            </h2>
            <p className="mt-2 text-gray-400 text-center lg:text-left">
              Bạn đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-purple hover:text-purple-light font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Họ và tên
              </label>
              <input
                id="fullName"
                type="text"
                {...register('fullName', {
                  required: 'Vui lòng nhập họ và tên',
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                placeholder="Nhập họ và tên"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                {...register('username', {
                  required: 'Vui lòng nhập tên đăng nhập',
                  minLength: {
                    value: 3,
                    message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
                  },
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ',
                  },
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber', {
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                placeholder="Nhập số điện thoại"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label
                htmlFor="birth"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Ngày sinh
              </label>
              <input
                id="birth"
                type="date"
                {...register('birth', {
                  required: 'Vui lòng chọn ngày sinh',
                })}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
              />
              {errors.birth && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.birth.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Giới tính
              </label>
              <select
                id="gender"
                {...register('gender')}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                {...register('address')}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Avatar */}
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Ảnh đại diện (tùy chọn)
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                {...register('imageFile')}
                className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  })}
                  className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) =>
                      value === password || 'Mật khẩu không khớp',
                  })}
                  className="w-full px-4 py-3 bg-dark-light border border-gray-custom rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50 text-white placeholder-gray-500"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-purple hover:bg-purple-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg shadow-purple/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
