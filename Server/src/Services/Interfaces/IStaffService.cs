using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Staff;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IStaffService
    {
        Task<Staff?> GetInfoStaffById(int id);
        Task<Staff> UpdateInfoStaff(UpdateStaffDto updateStaffDto, int id);
    }
}