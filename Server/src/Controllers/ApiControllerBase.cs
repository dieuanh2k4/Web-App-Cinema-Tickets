using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.Exceptions;
using Server.src.Exceptions;

namespace Server.src.Controllers
{
    public class ApiControllerBase : ControllerBase
    {
        protected ILogger _logger;
        public ApiControllerBase(ILogger logger)
        {
            _logger = logger;
        }

        protected IActionResult ReturnException(Exception ex)
        {
            if (ex is Result)
            {
                var userEx = ex as Result;
                return StatusCode(StatusCodes.Status400BadRequest, new ExceptionBody
                {
                    Message = userEx.Message
                });
            }

            _logger.LogError(ex, ex.Message);
            return StatusCode(StatusCodes.Status205ResetContent, new ExceptionBody
            {
                Message = ex.Message
            });
        }
    }
}