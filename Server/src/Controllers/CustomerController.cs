using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Customers;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customer;
        private readonly IMinioStorageService _minio;

        public CustomerController(ApplicationDbContext context, ICustomerService customer, IMinioStorageService minio, ILogger<CustomerController> logger) : base(logger)
        {
            _context = context;
            _customer = customer;
            _minio = minio;
        }

        [Authorize(Roles = "Customer, Admin")]
        [HttpGet("get-info-customer")]
        public async Task<IActionResult> GetInfoCustomer(int id)
        {
            try
            {
                var customer = await _customer.GetByIdAsync(id);

                return Ok(customer);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }

        [Authorize(Roles = "Customer, Admin")]
        [HttpPut("update-info-customer/{id}")]
        public async Task<IActionResult> UpdateInfoCustomer([FromForm] UpdateCustomerDto updateCustomerDto, IFormFile? imageFile, int id)
        {
            try
            {
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        updateCustomerDto.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        updateCustomerDto.Avatar = null;
                    }
                }

                var updateMovie = await _customer.UpdateInfoCustomer(updateCustomerDto, id);

                return Ok(updateMovie);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            } 
        }
    }
}