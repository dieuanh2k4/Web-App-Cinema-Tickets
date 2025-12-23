using Hangfire.Dashboard;

namespace Server.src.Utils
{
    /// <summary>
    /// Authorization filter cho Hangfire Dashboard
    /// CẢNH BÁO: Filter này cho phép tất cả người dùng truy cập dashboard trong môi trường dev
    /// Trong production, cần implement authorization thật sự (kiểm tra JWT, role Admin, v.v.)
    /// </summary>
    public class HangfireDashboardAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            // TODO: Trong production, kiểm tra JWT token hoặc role Admin
            // var httpContext = context.GetHttpContext();
            // return httpContext.User.Identity?.IsAuthenticated == true && 
            //        httpContext.User.IsInRole("Admin");
            
            // Development: cho phép tất cả
            return true;
        }
    }
}
