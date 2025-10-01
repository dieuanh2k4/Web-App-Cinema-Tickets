using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Rooms;
using Server.src.Mapper;
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
        public async Task<IActionResult> CreateRoom([FromBody] CreateRoomDto createRoomDto, int row, int seatsInRow, int vipSeats)
        {
            try
            {
                var newRoom = await _roomService.AddRooms(createRoomDto, row, seatsInRow, vipSeats);

                await _context.Rooms.AddAsync(newRoom);
                await _context.SaveChangesAsync();

                return Ok(newRoom);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}