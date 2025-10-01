using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Rooms;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IRoomService
    {
        Task<List<Rooms>> GetAllRooms();
        Task<Rooms> AddRooms(CreateRoomDto createRoomDto, int rows, int seatsInRow, int vipSeats);
    }
}