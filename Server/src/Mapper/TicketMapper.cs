using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Tickets;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class TicketMapper
    {
        public static TicketDto ToTicketDto(this Ticket ticket, List<Seats> seats)
        {
            return new TicketDto
            {
                Id = ticket.Id,
                ShowtimeId = ticket.ShowtimeId,
                CustomerId = ticket.UserId,
                CustomerName = ticket.User?.Name,
                CustomerEmail = ticket.User?.Email,
                CustomerPhone = ticket.User?.phoneNumber,
                MovieId = ticket.MovieId,
                MovieTitle = ticket.Movies?.Title,
                MovieThumbnail = ticket.Movies?.Thumbnail,
                RoomId = ticket.RoomId,
                RoomName = ticket.Rooms?.Name,
                TheaterId = ticket.Rooms?.TheaterId,
                TheaterName = ticket.Rooms?.Theater?.Name,
                Date = ticket.Date,
                StartTime = ticket.Showtimes?.Start ?? TimeOnly.MinValue,
                EndTime = ticket.Showtimes?.End ?? TimeOnly.MinValue,
                Seats = seats.Select(s => new SeatInfoDto
                {
                    SeatId = s.Id,
                    SeatName = s.Name,
                    SeatType = s.Type,
                    Price = s.Price
                }).ToList(),
                SumOfSeat = ticket.SumOfSeat,
                TotalPrice = ticket.TotalPrice,
                PaymentStatus = ticket.Payment?.Status,
                CreatedAt = DateTime.Now
            };
        }

        public static User ToCustomer(this CustomerInfoDto customerDto)
        {
            return new User
            {
                Name = customerDto.Name,
                Email = customerDto.Email,
                phoneNumber = customerDto.Phone,
                Birth = customerDto.Birth ?? DateOnly.FromDateTime(DateTime.Now),
                Gender = customerDto.Gender,
                Address = customerDto.Address
            };
        }
    }
}
