using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Rooms;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class RoomMapper
    {
        public static async Task<RoomDto> ToRoomDto(this Rooms rooms)
        {
            return new RoomDto
            {
                Name = rooms.Name,
                Capacity = rooms.Capacity,
                Status = rooms.Status,
                TheaterId = rooms.TheaterId,
                Type = rooms.Type,
                Seats = rooms.Seats.Select(s => s.ToNewSeats().Result).ToList()
            };
        }

        public static async Task<Rooms> ToNewRooms(this CreateRoomDto createRoomDto)
        {
            return new Rooms
            {
                Name = createRoomDto.Name,
                Capacity = createRoomDto.Capacity,
                Status = createRoomDto.Status ?? "Trống",
                TheaterId = createRoomDto.TheaterId,
                Type = createRoomDto.Type,
                Seats = new List<Seats>()
            };
        }

        public static async Task<CreateSeatDto> ToNewSeats(this Seats seats)
        {
            return new CreateSeatDto
            {
                Name = seats.Name,
                Price = seats.Price,
                Type = seats.Type,
                Status = seats.Status
            };
        }

        public static async Task<Seats> ToSeatsOfRoom(this CreateSeatDto createSeatDto, Rooms room)
        {
            return new Seats
            {
                // Id = createSeatDto.Id,
                Name = createSeatDto.Name,
                Price = createSeatDto.Price,
                Type = createSeatDto.Type,
                Status = createSeatDto.Status,
                Rooms = room
            };
        }
    }
}