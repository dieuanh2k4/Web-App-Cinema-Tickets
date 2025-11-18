import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';

type Step = 'email' | 'otp' | 'newPassword' | 'success';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 phút = 120 giây
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');

  // Đếm ngược thời gian OTP
  useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Format thời gian còn lại (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // STEP 1: Gửi email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Gửi OTP đến email:', email);
    
    // TODO: Call API gửi OTP
    // const response = await api.sendOTP(email);
    
    // Giả lập API success
    setTimeout(() => {
      setStep('otp');
      setTimeLeft(120);
    }, 500);
  };

  // STEP 2: Xác thực OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Vui lòng nhập đủ 6 số mã OTP');
      return;
    }

    if (timeLeft <= 0) {
      setError('Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.');
      return;
    }

    console.log('Xác thực OTP:', otpValue);
    
    // TODO: Call API verify OTP
    // const response = await api.verifyOTP(email, otpValue);
    
    // Giả lập API success
    setTimeout(() => {
      setStep('newPassword');
    }, 500);
  };

  // STEP 3: Đặt mật khẩu mới
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    console.log('Đặt mật khẩu mới cho:', email);
    
    // TODO: Call API reset password
    // const response = await api.resetPassword(email, newPassword);
    
    // Giả lập API success
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 500);
  };

  // Gửi lại OTP
  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    console.log('Gửi lại OTP đến:', email);
    
    // TODO: Call API gửi lại OTP
    // const response = await api.sendOTP(email);
    
    setTimeout(() => {
      setTimeLeft(120);
      setOtp(['', '', '', '', '', '']);
      setIsResending(false);
    }, 1000);
  };

  // Xử lý nhập OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Xử lý xóa OTP
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Xử lý paste OTP
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
  };

  return (
    <div className="auth-page">
      <div className="auth-overlay">
        <Link to="/" className="auth-logo">
          <h1>CINEBOOK</h1>
        </Link>

        <div className="movie-posters">
          <img src="https://images.unsplash.com/photo-1635805737707-575885ab0820?w=150" alt="Movie 1" />
          <img src="https://images.unsplash.com/photo-1574267432644-f74f8ec21d44?w=150" alt="Movie 2" />
          <img src="https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=150" alt="Movie 3" />
          <img src="https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=150" alt="Movie 4" />
          <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150" alt="Movie 5" />
          <img src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150" alt="Movie 6" />
        </div>

        <div className="auth-container">
          {/* STEP 1: Nhập Email */}
          {step === 'email' && (
            <>
              <div className="forgot-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>

              <h2 className="auth-title">Quên mật khẩu?</h2>
              
              <p className="forgot-description">
                Nhập email của bạn để nhận mã xác thực OTP
              </p>

              <form onSubmit={handleSendEmail} className="auth-form">
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                />

                <button type="submit" className="auth-button">
                  Gửi mã OTP
                </button>
              </form>

              <Link to="/login" className="back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Quay lại đăng nhập
              </Link>
            </>
          )}

          {/* STEP 2: Nhập OTP */}
          {step === 'otp' && (
            <>
              <div className="forgot-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>

              <h2 className="auth-title">Nhập mã OTP</h2>
              
              <p className="forgot-description">
                Mã OTP đã được gửi đến <strong>{email}</strong>
              </p>

              <form onSubmit={handleVerifyOTP} className="auth-form">
                <div className="otp-container" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="otp-input"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="otp-timer">
                  {timeLeft > 0 ? (
                    <p className="timer-text">
                      Mã OTP hết hạn sau: <span className="timer-count">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <p className="timer-expired">Mã OTP đã hết hạn</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={timeLeft <= 0}
                >
                  Xác nhận
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="resend-btn"
                  disabled={isResending || timeLeft > 0}
                >
                  {isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}
                </button>
              </form>

              <button onClick={() => setStep('email')} className="back-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Thay đổi email
              </button>
            </>
          )}

          {/* STEP 3: Đặt mật khẩu mới */}
          {step === 'newPassword' && (
            <>
              <div className="forgot-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                </svg>
              </div>

              <h2 className="auth-title">Tạo mật khẩu mới</h2>
              
              <p className="forgot-description">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>

              <form onSubmit={handleResetPassword} className="auth-form">
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />

                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                  minLength={6}
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="auth-button">
                  Đặt lại mật khẩu
                </button>
              </form>
            </>
          )}

          {/* STEP 4: Thành công */}
          {step === 'success' && (
            <div className="success-message">
              <div className="success-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#6c63ff" opacity="0.2"/>
                  <path d="M9 12l2 2 4-4" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" stroke="#6c63ff" strokeWidth="2"/>
                </svg>
              </div>

              <h2 className="auth-title">Đặt lại mật khẩu thành công!</h2>
              
              <p className="success-description">
                Mật khẩu của bạn đã được đặt lại thành công.
              </p>

              <p className="success-note">
                Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
              </p>

              <Link to="/login" className="auth-button">
                Đăng nhập ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;