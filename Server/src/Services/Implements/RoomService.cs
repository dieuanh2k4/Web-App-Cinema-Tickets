using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Rooms;
using Server.src.Dtos.Seats;
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
            room.Rows = rows;
            room.Columns = seatsInRow;
            room.Seats = new List<Seats>();
            var numberOfCoupleSeat = rows - coupleRowsSeats;

            // tạo ghế
            for (int row = 1; row <= rows; row++)
            {
                for (int seatNum = 1; seatNum <= seatsInRow; seatNum++)
                {
                    var seatType = row <= normalSeats
                        ? "Standard"
                        : (row > normalSeats && row <= numberOfCoupleSeat)
                            ? "VIP"
                            : (row > numberOfCoupleSeat)
                                ? "Couple"
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
                        Status = "Available"
                    };

                    var seat = await seatDto.ToSeatsOfRoom(room);

                    room.Seats.Add(seat);
                }
            }
            return room;
        }

        public async Task<Rooms> UpdateRoom([FromBody] UpdateRoomDto updateRoomDto, int row, int seatsInRow, int normalSeats, int coupleRowsSeats, int id)
        {
            var roomToUpdate = await _context.Rooms.Include(r => r.Seats).FirstOrDefaultAsync(r => r.Id == id);

            if (roomToUpdate == null)
            {
                throw new Result("Không tìm thấy phòng cần chỉnh sửa");
            }

            // Kiểm tra xem tên phòng mới có trùng với phòng nào khác trong cùng rạp không
            var existingRoomWithSameName = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Name == updateRoomDto.Name && r.TheaterId == roomToUpdate.TheaterId && r.Id != id);

            if (existingRoomWithSameName != null)
            {
                throw new Result($"Tên phòng '{updateRoomDto.Name}' đã tồn tại trong rạp này.");
            }

            // Cập nhật thông tin phòng
            roomToUpdate.Name = updateRoomDto.Name;
            roomToUpdate.Type = updateRoomDto.Type;
            roomToUpdate.Capacity = row * seatsInRow;

            // Xóa ghế cũ
            _context.Seats.RemoveRange(roomToUpdate.Seats);
            roomToUpdate.Seats = new List<Seats>();

            var numberOfCoupleSeat = row - coupleRowsSeats;

            // Tạo lại ghế mới
            for (int r = 1; r <= row; r++)
            {
                for (int seatNum = 1; seatNum <= seatsInRow; seatNum++)
                {
                    var seatType = r <= normalSeats
                        ? "Thường"
                        : (r > normalSeats && r <= numberOfCoupleSeat)
                            ? "Vip"
                            : (r > numberOfCoupleSeat)
                                ? "Đôi"
                                : "";

                    var ticketPrice = await _context.TicketPrices
                                .FirstOrDefaultAsync(t => t.RoomType == roomToUpdate.Type
                                                        && t.SeatType == seatType);

                    if (ticketPrice == null)
                    {
                        throw new Result($"Chưa có giá vé cho loại ghế {seatType} trong loại phòng {roomToUpdate.Type}");
                    }

                    var seatDto = new CreateSeatDto
                    {
                        Name = $"{(char)(64 + r)}{seatNum}",
                        Type = seatType,
                        Price = ticketPrice.Price,
                        Status = "Trống"
                    };

                    var seat = await seatDto.ToSeatsOfRoom(roomToUpdate);
                    roomToUpdate.Seats.Add(seat);
                }
            }

            // await _context.SaveChangesAsync();
            return roomToUpdate;
        }

        public async Task<Rooms> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                throw new Result("Không tìm thấy phòng cần xóa");
            }

            _context.Seats.RemoveRange(room.Seats);

            return room;
        }

        public async Task<Rooms> GetDetailRoomById(int id)
        {
            var room = await _context.Rooms
                    .Include(r => r.Seats)
                    .Include(r => r.Theater)
                    .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                throw new Result("Không tìm thấy phòng chiếu");
            }

            return room;
        }

        public async Task<Rooms> UpdateSeatLayout(UpdateSeatLayoutDto updateSeatLayoutDto, int id)
        {
            var room = await _context.Rooms
                    .Include(r => r.Seats)
                    .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                throw new Result("Không tìm thấy phòng chiếu");
            }

            if (updateSeatLayoutDto.Seats == null || !updateSeatLayoutDto.Seats.Any())
            {
                throw new Result("Danh sách ghế không được để trống");
            }

            // Cập nhật thông tin ghế
            foreach (var seatDto in updateSeatLayoutDto.Seats)
            {
                var seat = room.Seats?.FirstOrDefault(s => s.Id == seatDto.Id);
                if (seat != null)
                {
                    // seat.Row = seatDto.Row; // Row/Col đã bị xóa khỏi model
                    // seat.Col = seatDto.Col;
                    seat.Name = seatDto.Name;
                    seat.Price = seatDto.Price;
                    seat.Type = seatDto.Type;
                    seat.Status = seatDto.Status;
                }
            }

            return room;
        }
    }
}