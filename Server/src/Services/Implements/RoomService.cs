using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Rooms;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class RoomService : IRoomService
    {
        private static readonly List<Rooms> _rooms = new List<Rooms>();
        private readonly ApplicationDbContext _context;

        public RoomService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<List<Rooms>> GetAllRooms()
        {
            return _context.Rooms
                .Include(r => r.Seats)
                .ToListAsync();
        }

        public async Task<Rooms> AddRooms(CreateRoomDto createRoomDto, int rows, int seatsInRow, int vipSeats)
        {
            // tạo phòng chiếu phim mới
            if (createRoomDto.Name == null)
            {
                throw new Result("Tên phòng không được để trống");
            }

            var checkRoom = _rooms.FirstOrDefault(m => m.Name.Equals(createRoomDto.Name, StringComparison.OrdinalIgnoreCase));

            if (checkRoom != null)
            {
                throw new Result($"Phòng {createRoomDto.Name} đã tồn tại");
            }

            var room = await createRoomDto.ToNewRooms();
            room.Capacity = rows * seatsInRow;
            room.Seats = new List<Seats>();

            // tạo ghế
            for (int row = 1; row <= rows; row++)
            {
                for (int seatNum = 1; seatNum <= rows; seatNum++)
                {
                    var seatDto = new CreateSeatDto
                    {
                        Name = $"{(char)(64 + row)}{seatNum}",
                        Type = row <= vipSeats ? "Vip" : "Thường",
                        Price = row <= vipSeats ? 120000 : 90000
                    };

                    var seat = await seatDto.ToSeatsOfRoom(room);
                    room.Seats.Add(seat);
                }
            }

            return room;
        }
    }
}