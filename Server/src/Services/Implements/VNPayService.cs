using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.Extensions.Configuration;

namespace Server.src.Services.Implements
{
    public class VNPayService
    {
        private readonly IConfiguration _configuration;

        public VNPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(int ticketId, int amount, string orderInfo, string ipAddress)
        {
            var vnp_TmnCode = _configuration["VNPay:TmnCode"];
            var vnp_HashSecret = _configuration["VNPay:HashSecret"];
            var vnp_Url = _configuration["VNPay:Url"];
            var vnp_ReturnUrl = _configuration["VNPay:ReturnUrl"];

            var vnp_Params = new SortedList<string, string>
            {
                { "vnp_Version", "2.1.0" },
                { "vnp_Command", "pay" },
                { "vnp_TmnCode", vnp_TmnCode },
                { "vnp_Amount", (amount * 100).ToString() }, // VNPay requires amount * 100
                { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") },
                { "vnp_CurrCode", "VND" },
                { "vnp_IpAddr", ipAddress },
                { "vnp_Locale", "vn" },
                { "vnp_OrderInfo", orderInfo },
                { "vnp_OrderType", "other" },
                { "vnp_ReturnUrl", vnp_ReturnUrl },
                { "vnp_TxnRef", $"{ticketId}_{DateTime.Now.Ticks}" } // Unique transaction reference
            };

            // Build query string
            var query = string.Join("&", vnp_Params.Select(x => $"{x.Key}={HttpUtility.UrlEncode(x.Value)}"));

            // Generate secure hash
            var signData = string.Join("&", vnp_Params.Select(x => $"{x.Key}={x.Value}"));
            var vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);

            // Final URL
            var paymentUrl = $"{vnp_Url}?{query}&vnp_SecureHash={vnp_SecureHash}";

            return paymentUrl;
        }

        public bool ValidateSignature(Dictionary<string, string> vnpayData, string secureHash)
        {
            var vnp_HashSecret = _configuration["VNPay:HashSecret"];

            // Remove hash key before validation
            var dataToValidate = new SortedList<string, string>(vnpayData
                .Where(x => x.Key != "vnp_SecureHash" && x.Key != "vnp_SecureHashType")
                .ToDictionary(x => x.Key, x => x.Value));

            var signData = string.Join("&", dataToValidate.Select(x => $"{x.Key}={x.Value}"));
            var checkSum = HmacSHA512(vnp_HashSecret, signData);

            return checkSum.Equals(secureHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string HmacSHA512(string key, string data)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);

            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashBytes = hmac.ComputeHash(dataBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
