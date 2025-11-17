using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Rooms;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IRoomService _roomService;

        public RoomController(ApplicationDbContext context, IRoomService roomService, ILogger<RoomController> logger) : base(logger)
        {
            _context = context;
            _roomService = roomService;
        }

        [HttpGet("get-all-room")]
        public async Task<IActionResult> GetRooms()
        {
            try
            {
                var rooms = await _roomService.GetAllRooms();
                var roomsDto = rooms.Select(r => r.ToRoomDto());

                return Ok(rooms);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPost("create-rooms")]
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto createRoomDto, int row, int seatsInRow, int normalSeats, int coupleRowsSeats)
        {
            try
            {
                var newRoom = await _roomService.AddRooms(createRoomDto, row, seatsInRow, normalSeats, coupleRowsSeats);

                await _context.Rooms.AddAsync(newRoom);
                await _context.SaveChangesAsync();

                return Ok(newRoom);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ReturnException(ex);
            }
        }

        [HttpPut("update-room/{id}")]
        public async Task<IActionResult> UpdateRoom([FromBody] UpdateRoomDto updateRoomDto, int row, int seatsInRow, int normalSeats, int coupleRowsSeats, int id)
        {
            try
            {
                var updateRoom = await _roomService.UpdateRoom(updateRoomDto, row, seatsInRow, normalSeats, coupleRowsSeats, id);

                await _context.SaveChangesAsync();

                return Ok(updateRoom);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpDelete("delete-room/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                var deleteroom = await _roomService.DeleteRoom(id);

                _context.Rooms.Remove(deleteroom);
                await _context.SaveChangesAsync();

                return Ok(_roomService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}