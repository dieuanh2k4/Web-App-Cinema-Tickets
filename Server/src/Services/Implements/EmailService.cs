using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Server.src.Models;

namespace Server.src.Services.Implements
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly QRCodeService _qrCodeService;

        public EmailService(IConfiguration configuration, QRCodeService qrCodeService)
        {
            _configuration = configuration;
            _qrCodeService = qrCodeService;
        }

        /// <summary>
        /// Send ticket confirmation email with QR code
        /// </summary>
        public async Task SendTicketConfirmationAsync(
            string toEmail, 
            int ticketId, 
            string customerName,
            string movieTitle,
            string roomName,
            DateTime showtime,
            string[] seatNumbers,
            int totalAmount)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
                var smtpUser = _configuration["Email:SmtpUser"];
                var smtpPassword = _configuration["Email:SmtpPassword"];
                var fromEmail = _configuration["Email:FromEmail"];
                var fromName = _configuration["Email:FromName"];

                // Generate QR code
                var qrBase64 = _qrCodeService.GenerateQRCodeBase64(ticketId, customerName);

                // Create email
                using var message = new MailMessage();
                message.From = new MailAddress(fromEmail, fromName);
                message.To.Add(new MailAddress(toEmail));
                message.Subject = $"Vé xem phim CineBook - Mã vé #{ticketId:D8}";
                message.IsBodyHtml = true;

                // Email body with QR code
                message.Body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }}
        .container {{ background: white; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; }}
        .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }}
        .content {{ padding: 20px; }}
        .qr-code {{ text-align: center; padding: 20px; }}
        .qr-code img {{ border: 5px solid #8B5CF6; border-radius: 10px; }}
        .ticket-info {{ background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0; }}
        .ticket-info h3 {{ color: #8B5CF6; margin-top: 0; }}
        .info-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }}
        .label {{ color: #666; }}
        .value {{ font-weight: bold; color: #333; }}
        .footer {{ text-align: center; color: #666; font-size: 12px; padding: 20px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎬 CineBook</h1>
            <p>Xác nhận đặt vé thành công</p>
        </div>
        
        <div class='content'>
            <p>Xin chào <strong>{customerName}</strong>,</p>
            <p>Cảm ơn bạn đã đặt vé tại CineBook. Dưới đây là thông tin vé của bạn:</p>
            
            <div class='ticket-info'>
                <h3>📋 Thông tin vé</h3>
                <div class='info-row'>
                    <span class='label'>Mã vé:</span>
                    <span class='value'>#{ticketId:D8}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Phim:</span>
                    <span class='value'>{movieTitle}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Phòng chiếu:</span>
                    <span class='value'>{roomName}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Suất chiếu:</span>
                    <span class='value'>{showtime:dd/MM/yyyy HH:mm}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Ghế ngồi:</span>
                    <span class='value'>{string.Join(", ", seatNumbers)}</span>
                </div>
                <div class='info-row'>
                    <span class='label'>Tổng tiền:</span>
                    <span class='value'>{totalAmount:N0}₫</span>
                </div>
            </div>

            <div class='qr-code'>
                <h3 style='color: #8B5CF6;'>📱 Mã QR Check-in</h3>
                <img src='data:image/png;base64,{qrBase64}' alt='QR Code' style='width: 200px; height: 200px;'/>
                <p style='color: #666; font-size: 14px;'>Vui lòng xuất trình mã này tại quầy để check-in</p>
            </div>

            <div style='background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;'>
                <strong>⚠️ Lưu ý quan trọng:</strong>
                <ul style='margin: 10px 0; padding-left: 20px;'>
                    <li>Vui lòng đến trước giờ chiếu 15 phút</li>
                    <li>Xuất trình mã QR hoặc mã vé tại quầy</li>
                    <li>Không được chuyển nhượng vé</li>
                </ul>
            </div>
        </div>

        <div class='footer'>
            <p>Hotline hỗ trợ: 1900-xxxx</p>
            <p>Email: support@cinebook.com</p>
            <p>© 2025 CineBook - Cinema Ticket Booking System</p>
        </div>
    </div>
</body>
</html>
";

                // Send email
                using var smtpClient = new SmtpClient(smtpHost, smtpPort);
                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPassword);
                smtpClient.EnableSsl = true;

                await smtpClient.SendMailAsync(message);
                Console.WriteLine($"✅ Email sent to {toEmail} for ticket #{ticketId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending email: {ex.Message}");
                // Don't throw - email failure shouldn't break booking
            }
        }

        /// <summary>
        /// Send OTP email for password reset
        /// </summary>
        public async Task SendOTPEmailAsync(string toEmail, string otpCode)
        {
            try
            {
                var smtpHost = _configuration["Email:SmtpHost"];
                var smtpPort = int.Parse(_configuration["Email:SmtpPort"]);
                var smtpUser = _configuration["Email:SmtpUser"];
                var smtpPassword = _configuration["Email:SmtpPassword"];
                var fromEmail = _configuration["Email:FromEmail"];
                var fromName = _configuration["Email:FromName"];

                using var message = new MailMessage();
                message.From = new MailAddress(fromEmail, fromName);
                message.To.Add(new MailAddress(toEmail));
                message.Subject = "Mã OTP đặt lại mật khẩu - CineBook";
                message.IsBodyHtml = true;

                message.Body = $@"
<!DOCTYPE html>
<html>
<body style='font-family: Arial, sans-serif; padding: 20px;'>
    <div style='background: white; border-radius: 10px; padding: 30px; max-width: 500px; margin: 0 auto;'>
        <h2 style='color: #8B5CF6;'>🔐 Đặt lại mật khẩu</h2>
        <p>Mã OTP của bạn là:</p>
        <div style='background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;'>
            <h1 style='color: #8B5CF6; font-size: 36px; margin: 0; letter-spacing: 5px;'>{otpCode}</h1>
        </div>
        <p>Mã OTP có hiệu lực trong <strong>10 phút</strong>.</p>
        <p style='color: #666; font-size: 12px;'>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    </div>
</body>
</html>
";

                using var smtpClient = new SmtpClient(smtpHost, smtpPort);
                smtpClient.Credentials = new NetworkCredential(smtpUser, smtpPassword);
                smtpClient.EnableSsl = true;

                await smtpClient.SendMailAsync(message);
                Console.WriteLine($"✅ OTP email sent to {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending OTP email: {ex.Message}");
                throw;
            }
        }
    }
}
