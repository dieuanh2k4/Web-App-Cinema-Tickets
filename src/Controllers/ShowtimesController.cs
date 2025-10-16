using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController
    {
        private readonly ApplicationDbContext _context;

        public ShowtimesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // [HttpGet("get_all_showtimeId")]
        // public async Task<IActionResult> GetShowtime()
        // {
            
        // }
    }
}