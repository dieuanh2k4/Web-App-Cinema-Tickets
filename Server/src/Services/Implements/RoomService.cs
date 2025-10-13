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
        // private static readonly List<TicketPrice> _ticketPrice = new List<TicketPrice>();
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

        public async Task<Rooms> AddRooms(CreateRoomDto createRoomDto, int rows, int seatsInRow, int normalSeats, int coupleRowsSeats)
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

            // var checkRoomType = _ticketPrice.FirstOrDefault(t => t.RoomType.Equals(createRoomDto.Type, StringComparison.OrdinalIgnoreCase));
            var checkRoomType = await _context.TicketPrices
                .AnyAsync(t => t.RoomType == createRoomDto.Type);

            if (!checkRoomType)
            {
                throw new Result($"Loại phòng {createRoomDto.Type} không tồn tại");
            }

            var room = await createRoomDto.ToNewRooms();
            room.Capacity = rows * seatsInRow;
            room.Seats = new List<Seats>();
            var numberOfCoupleSeat = rows - coupleRowsSeats;

            // tạo ghế
            for (int row = 1; row <= rows; row++)
            {
                for (int seatNum = 1; seatNum <= seatsInRow; seatNum++)
                {
                    var seatType = row <= normalSeats 
                        ? "Thường"
                        : (row > normalSeats && row <= numberOfCoupleSeat)
                            ? "Vip"
                            : (row > numberOfCoupleSeat)
                                ? "Đôi"
                                : "";

                    var ticketPrice = await _context.TicketPrices
                                .FirstOrDefaultAsync(t => t.RoomType == createRoomDto.Type
                                                        && t.SeatType == seatType);

                    if (ticketPrice == null)
                    {
                        throw new Result($"Chưa có giá vé cho loại ghế {seatType} trong loại phòng {createRoomDto.Type}");
                    }

                    var seatDto = new CreateSeatDto
                    {
                        Name = $"{(char)(64 + row)}{seatNum}",
                        Type = seatType,
                        Price = ticketPrice.Price,
                        Status = "Trống"
                    };

                    var seat = await seatDto.ToSeatsOfRoom(room);

                    room.Seats.Add(seat);
                }
            }
            return room;
        }
    }
}