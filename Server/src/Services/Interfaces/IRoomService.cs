using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.Rooms;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IRoomService
    {
        Task<List<Rooms>> GetAllRooms();
        Task<Rooms> AddRooms(CreateRoomDto createRoomDto, int rows, int seatsInRow, int normalSeats, int coupleRowsSeats);
        Task<Rooms> UpdateRoom([FromBody] UpdateRoomDto updateRoomDto, int row, int seatsInRow, int normalSeats, int coupleRowsSeats, int id);
        Task<Rooms> DeleteRoom(int id);
    }
}