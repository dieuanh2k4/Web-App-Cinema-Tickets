using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Admin;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IAdminService
    {
        Task<Admin?> GetInfoAdminById(int id);
        Task<List<Admin>> GetAllInfoAdmin();
        Task<List<Staff>> GetAllStaff();
        Task<List<Customer>> GetAllCustomer();
        Task<Admin> UpdateInfoAdmin(UpdateAdminDto updateAdminDto, int id);
        Task<User> CreateAdmin(CreateAdminDto createAdminDto);
        Task<Admin> UpdateAdmin(UpdateAdminsDto updateAdminsDto, int id);
        Task<User> CreateStaff(CreateStaffDto createStaffDto);
        Task<Staff> UpdateStaff(UpdateStaffDto updateStaffDto, int id);
        Task<Admin> DeleteAdmin(int id);
        Task<Staff> DeleteStaff(int id);
    }
}