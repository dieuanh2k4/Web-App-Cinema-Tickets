namespace Server.src.Services.Interfaces
{
    public interface IVNPayService
    {
        string CreatePaymentUrl(int ticketId, int amount, string orderInfo, string ipAddress);
        bool ValidateSignature(Dictionary<string, string> vnpayData, string secureHash);
    }
}
