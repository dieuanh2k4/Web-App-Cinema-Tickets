using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Staff;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IStaffService _staff;
        private readonly IMinioStorageService _minio;

        public StaffController(ApplicationDbContext context, IStaffService staff, IMinioStorageService minio, ILogger<CustomerController> logger) : base(logger)
        {
            _context = context;
            _staff = staff;
            _minio = minio;
        }

        [Authorize(Roles = "Staff")]
        [HttpGet("get-info-staff")]
        public async Task<IActionResult> GetInfoStaff(int id)
        {
            try
            {
                var staff = await _staff.GetInfoStaffById(id);

                return Ok(staff);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Staff")]
        [HttpPut("update-info-staff/{id}")]
        public async Task<IActionResult> UpdateInfoStaff([FromForm] UpdateStaffDto updateStaffDto, IFormFile? imageFile, int id)
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

                var updateStaff = await _staff.UpdateInfoStaff(updateStaffDto, id);

                return Ok(updateStaff);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }
    }
}