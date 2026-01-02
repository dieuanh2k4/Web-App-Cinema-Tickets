using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;

namespace Server.src.Data
{
    /// Class để seed dữ liệu mẫu cho hệ thống RBAC
    public class RbacSeeder
    {
        public static void SeedRbacData(ApplicationDbContext context)
        {
            // Kiểm tra nếu đã có dữ liệu thì không seed nữa
            if (context.Roles.Any() || context.Permissions.Any())
            {
                return;
            }

            // Tạo Permissions
            var permissions = new List<Permission>
            {
                // User Module
                new Permission { Name = "Xem danh sách user", Code = "USER_VIEW", Module = "User", Description = "Xem danh sách tất cả người dùng" },
                new Permission { Name = "Tạo user", Code = "USER_CREATE", Module = "User", Description = "Tạo người dùng mới" },
                new Permission { Name = "Cập nhật user", Code = "USER_UPDATE", Module = "User", Description = "Cập nhật thông tin người dùng" },
                new Permission { Name = "Xóa user", Code = "USER_DELETE", Module = "User", Description = "Xóa người dùng" },
                
                // Movie Module
                new Permission { Name = "Xem danh sách phim", Code = "MOVIE_VIEW", Module = "Movie", Description = "Xem danh sách tất cả phim" },
                new Permission { Name = "Tạo phim", Code = "MOVIE_CREATE", Module = "Movie", Description = "Tạo phim mới" },
                new Permission { Name = "Cập nhật phim", Code = "MOVIE_UPDATE", Module = "Movie", Description = "Cập nhật thông tin phim" },
                new Permission { Name = "Xóa phim", Code = "MOVIE_DELETE", Module = "Movie", Description = "Xóa phim" },
                
                // Booking Module
                new Permission { Name = "Xem danh sách booking", Code = "BOOKING_VIEW", Module = "Booking", Description = "Xem danh sách đặt vé" },
                new Permission { Name = "Tạo booking", Code = "BOOKING_CREATE", Module = "Booking", Description = "Tạo đặt vé mới" },
                new Permission { Name = "Cập nhật booking", Code = "BOOKING_UPDATE", Module = "Booking", Description = "Cập nhật thông tin đặt vé" },
                new Permission { Name = "Hủy booking", Code = "BOOKING_CANCEL", Module = "Booking", Description = "Hủy đặt vé" },
                
                // Theater Module
                new Permission { Name = "Xem danh sách rạp", Code = "THEATER_VIEW", Module = "Theater", Description = "Xem danh sách rạp chiếu" },
                new Permission { Name = "Tạo rạp", Code = "THEATER_CREATE", Module = "Theater", Description = "Tạo rạp mới" },
                new Permission { Name = "Cập nhật rạp", Code = "THEATER_UPDATE", Module = "Theater", Description = "Cập nhật thông tin rạp" },
                new Permission { Name = "Xóa rạp", Code = "THEATER_DELETE", Module = "Theater", Description = "Xóa rạp" },
                
                // Room Module
                new Permission { Name = "Xem danh sách phòng", Code = "ROOM_VIEW", Module = "Room", Description = "Xem danh sách phòng chiếu" },
                new Permission { Name = "Tạo phòng", Code = "ROOM_CREATE", Module = "Room", Description = "Tạo phòng mới" },
                new Permission { Name = "Cập nhật phòng", Code = "ROOM_UPDATE", Module = "Room", Description = "Cập nhật thông tin phòng" },
                new Permission { Name = "Xóa phòng", Code = "ROOM_DELETE", Module = "Room", Description = "Xóa phòng" },
                
                // Showtime Module
                new Permission { Name = "Xem lịch chiếu", Code = "SHOWTIME_VIEW", Module = "Showtime", Description = "Xem lịch chiếu phim" },
                new Permission { Name = "Tạo lịch chiếu", Code = "SHOWTIME_CREATE", Module = "Showtime", Description = "Tạo lịch chiếu mới" },
                new Permission { Name = "Cập nhật lịch chiếu", Code = "SHOWTIME_UPDATE", Module = "Showtime", Description = "Cập nhật lịch chiếu" },
                new Permission { Name = "Xóa lịch chiếu", Code = "SHOWTIME_DELETE", Module = "Showtime", Description = "Xóa lịch chiếu" },
                
                // Payment Module
                new Permission { Name = "Xem danh sách thanh toán", Code = "PAYMENT_VIEW", Module = "Payment", Description = "Xem danh sách thanh toán" },
                new Permission { Name = "Xác nhận thanh toán", Code = "PAYMENT_CONFIRM", Module = "Payment", Description = "Xác nhận thanh toán" },
                new Permission { Name = "Hoàn tiền", Code = "PAYMENT_REFUND", Module = "Payment", Description = "Hoàn tiền cho khách hàng" },
                
                // Report Module
                new Permission { Name = "Xem báo cáo", Code = "REPORT_VIEW", Module = "Report", Description = "Xem báo cáo thống kê" },
                new Permission { Name = "Xuất báo cáo", Code = "REPORT_EXPORT", Module = "Report", Description = "Xuất báo cáo" },
                
                // Role Module
                new Permission { Name = "Quản lý role", Code = "ROLE_MANAGE", Module = "Role", Description = "Quản lý roles và permissions" },
            };

            context.Permissions.AddRange(permissions);
            context.SaveChanges();

            // Tạo Roles
            var adminRole = new Roles 
            { 
                Name = "Admin", 
                Description = "Quản trị viên hệ thống - có toàn quyền",
                // IsActive = true
            };

            // var managerRole = new Roles 
            // { 
            //     Name = "Manager", 
            //     Description = "Quản lý rạp - quản lý phim, lịch chiếu, rạp",
            //     // IsActive = true
            // };

            var staffRole = new Roles 
            { 
                Name = "Staff", 
                Description = "Nhân viên - xử lý đặt vé và thanh toán",
                // IsActive = true
            };

            var customer = new Roles 
            { 
                Name = "Customer", 
                Description = "Khách hàng",
                // IsActive = true
            };

            context.Roles.AddRange(new[] { adminRole, staffRole, customer });
            context.SaveChanges();

            // Gán Permissions cho Admin Role (toàn quyền)
            var adminPermissions = permissions.Select(p => new RolePermission
            {
                RoleId = adminRole.Id,
                PermissionId = p.Id
            }).ToList();

            // // Gán Permissions cho Manager Role
            // var managerPermissions = permissions
            //     .Where(p => p.Module == "Movie" || 
            //                p.Module == "Theater" || 
            //                p.Module == "Room" || 
            //                p.Module == "Showtime" ||
            //                p.Module == "Report" ||
            //                (p.Module == "Booking" && p.Code != "BOOKING_CREATE"))
            //     .Select(p => new RolePermission
            //     {
            //         RoleId = managerRole.Id,
            //         PermissionId = p.Id
            //     }).ToList();

            // Gán Permissions cho Staff Role
            var staffPermissions = permissions
                .Where(p => p.Module == "Booking" || 
                           p.Module == "Payment" ||
                           (p.Module == "Movie" && p.Code == "MOVIE_VIEW") ||
                           (p.Module == "Showtime" && p.Code == "SHOWTIME_VIEW"))
                .Select(p => new RolePermission
                {
                    RoleId = staffRole.Id,
                    PermissionId = p.Id
                }).ToList();

            // Gán Permissions cho Customer Role
            var customerPermissions = permissions
                .Where(p => p.Code == "BOOKING_VIEW" || 
                           p.Code == "USER_VIEW" ||
                           p.Code == "MOVIE_VIEW" ||
                           p.Code == "PAYMENT_VIEW")
                .Select(p => new RolePermission
                {
                    RoleId = customer.Id,
                    PermissionId = p.Id
                }).ToList();

            context.RolePermissions.AddRange(adminPermissions);
            // context.RolePermissions.AddRange(managerPermissions);
            context.RolePermissions.AddRange(staffPermissions);
            context.RolePermissions.AddRange(customerPermissions);
            context.SaveChanges();

            Console.WriteLine("RBAC data seeded successfully!");
        }
    }
}
