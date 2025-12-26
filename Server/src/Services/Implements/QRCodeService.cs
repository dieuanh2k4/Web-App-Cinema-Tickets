using System;
using System.IO;
using System.Threading.Tasks;
using QRCoder;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class QRCodeService
    {
        private readonly IMinioStorageService _minioService;

        public QRCodeService(IMinioStorageService minioService)
        {
            _minioService = minioService;
        }

        /// <summary>
        /// Generate QR code from ticket ID and upload to MinIO
        /// </summary>
        public async Task<string> GenerateQRCodeAsync(int ticketId, string customerName)
        {
            try
            {
                // Create QR code content
                string qrContent = $"CINEBOOK-TICKET-{ticketId:D8}|{customerName}|{DateTime.Now:yyyy-MM-dd}";

                // Generate QR code
                using var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode(qrContent, QRCodeGenerator.ECCLevel.Q);
                var qrCode = new PngByteQRCode(qrCodeData);
                byte[] qrCodeBytes = qrCode.GetGraphic(20);

                // Convert to stream for upload
                using var stream = new MemoryStream(qrCodeBytes);
                
                // Upload to MinIO - create IFormFile from stream
                var formFile = new FormFile(stream, 0, qrCodeBytes.Length, "qrcode", $"ticket-{ticketId}.png")
                {
                    Headers = new HeaderDictionary(),
                    ContentType = "image/png"
                };
                
                var qrUrl = await _minioService.UploadImageAsync(formFile, "qr-codes");

                return qrUrl;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating QR code: {ex.Message}");
                throw new Exception("Không thể tạo mã QR", ex);
            }
        }

        /// <summary>
        /// Generate QR code as base64 string (for email embedding)
        /// </summary>
        public string GenerateQRCodeBase64(int ticketId, string customerName)
        {
            try
            {
                string qrContent = $"CINEBOOK-TICKET-{ticketId:D8}|{customerName}|{DateTime.Now:yyyy-MM-dd}";

                using var qrGenerator = new QRCodeGenerator();
                var qrCodeData = qrGenerator.CreateQrCode(qrContent, QRCodeGenerator.ECCLevel.Q);
                var qrCode = new PngByteQRCode(qrCodeData);
                byte[] qrCodeBytes = qrCode.GetGraphic(20);

                return Convert.ToBase64String(qrCodeBytes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating QR code base64: {ex.Message}");
                throw new Exception("Không thể tạo mã QR", ex);
            }
        }
    }
}
