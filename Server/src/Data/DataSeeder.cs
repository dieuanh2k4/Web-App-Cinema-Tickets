using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;
using Server.src.Utils;

namespace Server.src.Data
{
    public static class DataSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            // Migration đã được chạy rồi, không cần gọi lại
            // context.Database.Migrate();

            // 1. Seed Users
            if (!context.User.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        username = "admin",
                        password = PasswordHelper.HashPassword("admin123"),
                        userType = 0 // 0 = Admin
                    },
                    new User
                    {
                        username = "staff",
                        password = PasswordHelper.HashPassword("staff123"),
                        userType = 1 // 1 = Staff
                    },
                    new User
                    {
                        username = "customer",
                        password = PasswordHelper.HashPassword("customer123"),
                        userType = 2 // 2 = Customer
                    }
                };

                context.User.AddRange(users);
                context.SaveChanges();
                Console.WriteLine("Đã tạo 3 users");
            }

            // 2. Seed Theaters
            if (!context.Theater.Any())
            {
                var theaters = new List<Theater>
                {
                    new Theater
                    {
                        Name = "CGV Vincom Center",
                        Address = "72 Lê Thánh Tôn, Quận 1, TP.HCM",
                        City = "TP.HCM"
                    },
                    new Theater
                    {
                        Name = "Galaxy Nguyễn Du",
                        Address = "116 Nguyễn Du, Quận 1, TP.HCM",
                        City = "TP.HCM"
                    },
                    new Theater
                    {
                        Name = "Lotte Cinema Cộng Hòa",
                        Address = "180 Cộng Hòa, Tân Bình, TP.HCM",
                        City = "TP.HCM"
                    }
                };

                context.Theater.AddRange(theaters);
                context.SaveChanges();
                Console.WriteLine("✅ Đã tạo 3 theaters");
            }

            // 3. Seed Rooms
            if (!context.Rooms.Any())
            {
                var theater1 = context.Theater.First(t => t.Name == "CGV Vincom Center");
                var theater2 = context.Theater.First(t => t.Name == "Galaxy Nguyễn Du");

                var rooms = new List<Rooms>
                {
                    new Rooms
                    {
                        Name = "Phòng 1",
                        TheaterId = theater1.Id,
                        Capacity = 100,
                        Status = "Available"
                    },
                    new Rooms
                    {
                        Name = "Phòng 2",
                        TheaterId = theater1.Id,
                        Capacity = 80,
                        Status = "Available"
                    },
                    new Rooms
                    {
                        Name = "Phòng IMAX",
                        TheaterId = theater2.Id,
                        Capacity = 150,
                        Status = "Available"
                    },
                    new Rooms
                    {
                        Name = "Phòng VIP",
                        TheaterId = theater2.Id,
                        Capacity = 50,
                        Status = "Available"
                    }
                };

                context.Rooms.AddRange(rooms);
                context.SaveChanges();
                Console.WriteLine("✅ Đã tạo 4 rooms");
            }

            // 4. Seed Seats
            if (!context.Seats.Any())
            {
                var rooms = context.Rooms.ToList();
                var seats = new List<Seats>();

                foreach (var room in rooms)
                {
                    int seatsPerRow = 10;
                    int totalRows = room.Capacity / seatsPerRow;

                    for (int row = 0; row < totalRows; row++)
                    {
                        char rowLetter = (char)('A' + row);
                        for (int seatNum = 1; seatNum <= seatsPerRow; seatNum++)
                        {
                            seats.Add(new Seats
                            {
                                Name = $"{rowLetter}{seatNum}",
                                RoomId = room.Id,
                                Type = (row < 2) ? "VIP" : "Standard",
                                Status = "Available",
                                Price = (row < 2) ? 150000 : 100000
                            });
                        }
                    }
                }

                context.Seats.AddRange(seats);
                context.SaveChanges();
                Console.WriteLine($"✅ Đã tạo {seats.Count} seats");
            }

            // 5. Seed Movies
            if (!context.Movies.Any())
            {
                var movies = new List<Movies>
                {
                    new Movies
                    {
                        Title = "Avatar: The Way of Water",
                        Description = "Jake Sully và Neytiri đã lập gia đình và đang cố gắng bảo vệ gia đình khỏi mối đe dọa mới",
                        Duration = 192,
                        Genre = "Sci-Fi, Adventure",
                        Language = "Tiếng Anh - Phụ đề Việt",
                        Director = "James Cameron",
                        Actors = new List<string> { "Sam Worthington", "Zoe Saldana", "Sigourney Weaver" },
                        AgeLimit = "T13",
                        StartDate = DateTime.UtcNow.Date.AddDays(-7),
                        EndDate = DateTime.UtcNow.Date.AddDays(30),
                        Thumbnail = "https://res.cloudinary.com/demo/image/upload/avatar2.jpg",
                        Rating = 8.5
                    },
                    new Movies
                    {
                        Title = "Avengers: Endgame",
                        Description = "Sau sự kiện tàn khốc, các Avengers tập hợp lần cuối để đảo ngược hành động của Thanos",
                        Duration = 181,
                        Genre = "Action, Adventure, Sci-Fi",
                        Language = "Tiếng Anh - Phụ đề Việt",
                        Director = "Russo Brothers",
                        Actors = new List<string> { "Robert Downey Jr.", "Chris Evans", "Mark Ruffalo" },
                        AgeLimit = "T13",
                        StartDate = DateTime.UtcNow.Date.AddDays(-14),
                        EndDate = DateTime.UtcNow.Date.AddDays(20),
                        Thumbnail = "https://res.cloudinary.com/demo/image/upload/avengers.jpg",
                        Rating = 9.0
                    },
                    new Movies
                    {
                        Title = "Mắt Biếc",
                        Description = "Chuyện tình đầu thơ ngây của Ngạn và Hà Lan trong làng quê Việt Nam",
                        Duration = 117,
                        Genre = "Romance, Drama",
                        Language = "Tiếng Việt",
                        Director = "Victor Vũ",
                        Actors = new List<string> { "Trần Nghĩa", "Trúc Anh" },
                        AgeLimit = "T13",
                        StartDate = DateTime.UtcNow.Date.AddDays(-5),
                        EndDate = DateTime.UtcNow.Date.AddDays(25),
                        Thumbnail = "https://res.cloudinary.com/demo/image/upload/matbiec.jpg",
                        Rating = 7.5
                    }
                };

                context.Movies.AddRange(movies);
                context.SaveChanges();
                Console.WriteLine("✅ Đã tạo 3 movies");
            }

            // 6. Seed Showtimes
            if (!context.Showtimes.Any())
            {
                var movie1 = context.Movies.First(m => m.Title == "Avatar: The Way of Water");
                var movie2 = context.Movies.First(m => m.Title == "Avengers: Endgame");
                var movie3 = context.Movies.First(m => m.Title == "Mắt Biếc");
                
                var room1 = context.Rooms.First(r => r.Name == "Phòng 1");
                var room2 = context.Rooms.First(r => r.Name == "Phòng 2");
                var roomIMAX = context.Rooms.First(r => r.Name == "Phòng IMAX");

                var today = DateTime.Today;
                var showtimes = new List<Showtimes>
                {
                    // Avatar - hôm nay
                    new Showtimes
                    {
                        MovieId = movie1.Id,
                        RoomId = roomIMAX.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(14, 30),
                        End = new TimeOnly(17, 42)
                    },
                    new Showtimes
                    {
                        MovieId = movie1.Id,
                        RoomId = roomIMAX.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(18, 0),
                        End = new TimeOnly(21, 12)
                    },
                    new Showtimes
                    {
                        MovieId = movie1.Id,
                        RoomId = roomIMAX.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(21, 30),
                        End = new TimeOnly(0, 42)
                    },

                    // Avengers - hôm nay
                    new Showtimes
                    {
                        MovieId = movie2.Id,
                        RoomId = room1.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(15, 0),
                        End = new TimeOnly(18, 1)
                    },
                    new Showtimes
                    {
                        MovieId = movie2.Id,
                        RoomId = room1.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(19, 30),
                        End = new TimeOnly(22, 31)
                    },

                    // Mắt Biếc - hôm nay
                    new Showtimes
                    {
                        MovieId = movie3.Id,
                        RoomId = room2.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(16, 0),
                        End = new TimeOnly(17, 57)
                    },
                    new Showtimes
                    {
                        MovieId = movie3.Id,
                        RoomId = room2.Id,
                        Date = DateOnly.FromDateTime(today),
                        Start = new TimeOnly(20, 0),
                        End = new TimeOnly(21, 57)
                    },

                    // Avatar - ngày mai
                    new Showtimes
                    {
                        MovieId = movie1.Id,
                        RoomId = roomIMAX.Id,
                        Date = DateOnly.FromDateTime(today.AddDays(1)),
                        Start = new TimeOnly(14, 0),
                        End = new TimeOnly(17, 12)
                    }
                };

                context.Showtimes.AddRange(showtimes);
                context.SaveChanges();
                Console.WriteLine("✅ Đã tạo 8 showtimes");
            }

            // 7. Seed TicketPrices
            if (!context.TicketPrices.Any())
            {
                var ticketPrices = new List<TicketPrice>
                {
                    new TicketPrice
                    {
                        RoomType = "Standard",
                        SeatType = "Standard",
                        Price = 80000
                    },
                    new TicketPrice
                    {
                        RoomType = "Standard",
                        SeatType = "VIP",
                        Price = 120000
                    },
                    new TicketPrice
                    {
                        RoomType = "IMAX",
                        SeatType = "Standard",
                        Price = 150000
                    },
                    new TicketPrice
                    {
                        RoomType = "IMAX",
                        SeatType = "VIP",
                        Price = 200000
                    }
                };

                context.TicketPrices.AddRange(ticketPrices);
                context.SaveChanges();
                Console.WriteLine("✅ Đã tạo 4 ticket prices");
            }

            Console.WriteLine("\nData User hoàn thành!");
        }
    }
}