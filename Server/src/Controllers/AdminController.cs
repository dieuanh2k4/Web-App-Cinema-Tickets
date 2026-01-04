using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Admin;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAdminService _admin;
        private readonly IMinioStorageService _minio;

        public AdminController(ApplicationDbContext context, IAdminService admin, IMinioStorageService minio, ILogger<CustomerController> logger) : base(logger)
        {
            _context = context;
            _admin = admin;
            _minio = minio;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-info-admin")]
        public async Task<IActionResult> GetInfoAdmin(int id)
        {
            try
            {
                var customer = await _admin.GetInfoAdminById(id);

                return Ok(customer);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update-info-admin/{id}")]
        public async Task<IActionResult> UpdateInfoAdmin([FromForm] UpdateAdminDto updateAdminDto, IFormFile? imageFile, int id)
        {
            try
            {
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        updateAdminDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        updateAdminDto.Avatar = null;
                    }
                }

                var updateMovie = await _admin.UpdateInfoAdmin(updateAdminDto, id);

                return Ok(updateMovie);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-all-admin")]
        public async Task<IActionResult> GetAllAdmin()
        {
            try
            {
                var admin = await _admin.GetAllInfoAdmin();

                return Ok(admin);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-all-staff")]
        public async Task<IActionResult> GetAllStaff()
        {
            try
            {
                var staff = await _admin.GetAllStaff();

                return Ok(staff);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-all-customer")]
        public async Task<IActionResult> GetAllCustomer()
        {
            try
            {
                var customer = await _admin.GetAllCustomer();

                return Ok(customer);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromForm] CreateAdminDto createAdminDto, IFormFile? imageFile)
        {
            try
            {
                // Upload avatar nếu có
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        createAdminDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        createAdminDto.Avatar = null;
                    }
                }

                var newUser = await _admin.CreateAdmin(createAdminDto);
                
                return Ok(new { 
                    message = "Đăng ký thành công",
                    user = newUser 
                });  
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update-admin/{id}")]
        public async Task<IActionResult> UpdateAdmin([FromForm] UpdateAdminsDto updateAdminsDto, IFormFile? imageFile, int id)
        {
            try
            {
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        updateAdminsDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        updateAdminsDto.Avatar = null;
                    }
                }

                var updateAdmin = await _admin.UpdateAdmin(updateAdminsDto, id);

                return Ok(updateAdmin);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-staff")]
        public async Task<IActionResult> CreateStaff([FromForm] CreateStaffDto createStaffDto, IFormFile? imageFile)
        {
            try
            {
                // Upload avatar nếu có
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        createStaffDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        createStaffDto.Avatar = null;
                    }
                }

                var newUser = await _admin.CreateStaff(createStaffDto);
                
                return Ok(new { 
                    message = "Đăng ký thành công",
                    user = newUser 
                });  
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update-staff/{id}")]
        public async Task<IActionResult> UpdateStaff([FromForm] UpdateStaffDto updateStaffDto, IFormFile? imageFile, int id)
        {
            try
            {
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        updateStaffDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        updateStaffDto.Avatar = null;
                    }
                }

                var updateStaff = await _admin.UpdateStaff(updateStaffDto, id);

                return Ok(updateStaff);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-admin/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            try
            {
                var deletedAdmin = await _admin.DeleteAdmin(id);
                
                return Ok(new { 
                    message = "Xóa Admin thành công",
                    admin = deletedAdmin 
                });  
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-staff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            try
            {
                var deletedStaff = await _admin.DeleteStaff(id);
                
                return Ok(new { 
                    message = "Xóa Staff thành công",
                    staff = deletedStaff 
                });  
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-customer/{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            try
            {
                var deletedCustomer = await _admin.DeleteCustomer(id);
                
                return Ok(new { 
                    message = "Xóa Customer thành công",
                    staff = deletedCustomer 
                });  
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }
    }
}