using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Staff;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class StaffService : IStaffService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMinioStorageService _minio;

        public StaffService(ApplicationDbContext context, IMinioStorageService minio)
        {
            _context = context;
            _minio = minio;
        }

        public async Task<Staff?> GetInfoStaffById(int id)
        {
            var staff = await _context.Staff.FirstOrDefaultAsync(c => c.Id == id);
            
            // Chuyển path thành URL
            if (staff != null && !string.IsNullOrEmpty(staff.Avatar))
            {
                staff.Avatar = _minio.GetImageUrl(staff.Avatar);
            }
            
            return staff;
        }

        public async Task<Staff> UpdateInfoStaff(UpdateStaffDto updateStaffDto, int id)
        {
            var staff = await _context.Staff.FindAsync(id);

            staff.Address = updateStaffDto.Address;
            staff.Avatar = updateStaffDto.Avatar;
            staff.Birth = updateStaffDto.Birth;
            staff.Email = updateStaffDto.Email;
            staff.Gender = updateStaffDto.Gender;
            staff.Name = updateStaffDto.Name;
            staff.Phone = updateStaffDto.Phone;

            await _context.SaveChangesAsync();

            // Chuyển path thành URL khi trả về
            if (!string.IsNullOrEmpty(staff.Avatar))
            {
                staff.Avatar = _minio.GetImageUrl(staff.Avatar);
            }

            return staff;
        }
    }
}