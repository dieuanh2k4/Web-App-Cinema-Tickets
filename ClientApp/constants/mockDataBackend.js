// Mock data phù hợp với cấu trúc backend C# - VERSION ÍT DATA ĐỂ TEST
// Giống với Models: Movies, Theater, Rooms, Showtimes, Seats, Ticket

// ============= MOVIES (5 đang chiếu, 4 sắp chiếu) =============
export const mockMovies = [
  {
    id: 1,
    title: "Mai",
    thumbnail:
      "https://images2.thanhnien.vn/528068263637045248/2024/2/20/special-poster-2-mai-17084211313531000860296.jpg",
    posterUrl:
      "https://cdn-images.vtv.vn/562122370168008704/2023/11/28/photo-1-17011453442011344132442.jpg",
    duration: 131,
    genre: "Tâm Lý, Gia Đình",
    language: "Tiếng Việt",
    ageLimit: "T16",
    startDate: "2024-10-15T00:00:00",
    endDate: "2025-03-15T00:00:00",
    description:
      "Một câu chuyện gia đình đầy cảm động về tình mẫu tử, sự hy sinh và những giá trị nhân văn.",
    director: "Trần Đức Long",
    actors: ["Phương Oanh", "Tuấn Trần", "Ngọc Lan"],
    rating: 9.1,
    status: "Đang chiếu",
  },
  {
    id: 2,
    title: "Đất Rừng Phương Nam",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/vi/thumb/8/8c/%C4%90%E1%BA%A5t_r%E1%BB%ABng_ph%C6%B0%C6%A1ng_Nam_-_Official_poster.jpg/250px-%C4%90%E1%BA%A5t_r%E1%BB%ABng_ph%C6%B0%C6%A1ng_Nam_-_Official_poster.jpghttps://vcdn1-giaitri.vnecdn.net/2023/05/09/dat-rung-phuong-nam-poster-jpe-4998-2212-1683637954.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=KFhSohck0c5c7MuDlhsRxg",
    posterUrl:
      "https://vcdn1-giaitri.vnecdn.net/2023/05/09/dat-rung-phuong-nam-poster-jpe-4998-2212-1683637954.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=KFhSohck0c5c7MuDlhsRxg",
    duration: 120,
    genre: "Phiêu Lưu, Gia Đình",
    language: "Tiếng Việt",
    ageLimit: "P",
    startDate: "2024-09-20T00:00:00",
    endDate: "2025-01-31T00:00:00",
    description:
      "Cuộc phiêu lưu đầy thú vị qua những vùng đất hoang sơ của miền Nam.",
    director: "Nguyễn Quang Dũng",
    actors: ["Hồng Ánh", "Trấn Thành", "Việt Hương"],
    rating: 7.8,
    status: "Đang chiếu",
  },
  {
    id: 3,
    title: "Mufasa: The Lion King",
    thumbnail:
      "https://lumiere-a.akamaihd.net/v1/images/p_mufasa_thelionking_2024_v2_495_e900f63b.jpeg",
    posterUrl: "https://m.media-amazon.com/images/I/A1z543w2WVL.jpg ",
    duration: 118,
    genre: "Hoạt Hình, Phiêu Lưu",
    language: "Tiếng Anh",
    ageLimit: "P",
    startDate: "2024-11-01T00:00:00",
    endDate: "2025-02-28T00:00:00",
    description:
      "Câu chuyện về nguồn gốc của Mufasa, vị vua sư tử huyền thoại.",
    director: "Barry Jenkins",
    actors: ["Aaron Pierre", "Kelvin Harrison Jr.", "Tiffany Boone"],
    rating: 8.2,
    status: "Đang chiếu",
  },
  {
    id: 4,
    title: "Wicked",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/vi/9/90/Wicked_%28film%2C_poster%29.jpeg",
    posterUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/w/f/wfg-470x700.jpg",
    duration: 160,
    genre: "Nhạc Kịch, Giả Tưởng",
    language: "Tiếng Anh",
    ageLimit: "T13",
    startDate: "2024-11-10T00:00:00",
    endDate: "2025-03-31T00:00:00",
    description:
      "Câu chuyện chưa từng được kể về phù thủy xứ Oz trước khi Dorothy đến.",
    director: "Jon M. Chu",
    actors: ["Cynthia Erivo", "Ariana Grande", "Jonathan Bailey"],
    rating: 8.5,
    status: "Đang chiếu",
  },
  {
    id: 5,
    title: "Moana 2",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/en/7/73/Moana_2_poster.jpg",
    posterUrl:
      "https://play-lh.googleusercontent.com/uj6uKgJHI5LT3dC3_aqNLCoYF-znbZsbOGpWvsViD3U-kM0Mt-jaGWdKLuEN-g6V3eHk3VzDQzG0wwjwqHc=w240-h480-rw",
    duration: 100,
    genre: "Hoạt Hình, Phiêu Lưu",
    language: "Tiếng Anh",
    ageLimit: "P",
    startDate: "2024-11-15T00:00:00",
    endDate: "2025-02-28T00:00:00",
    description:
      "Moana và Maui tiếp tục cuộc hành trình khám phá đại dương bao la.",
    director: "David Derrick Jr.",
    actors: ["Auli'i Cravalho", "Dwayne Johnson"],
    rating: 8.0,
    status: "Đang chiếu",
  },
  {
    id: 6,
    title: "Sonic the Hedgehog 3",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/vi/1/11/SONIC_THE_HEDGEHOG_3_%E2%80%93_Vietnam_poster.jpg",
    posterUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/s/t/sth3_poster_470x700.jpg",
    duration: 109,
    genre: "Hành Động, Phiêu Lưu",
    language: "Tiếng Anh",
    ageLimit: "P",
    startDate: "2025-12-20T00:00:00",
    endDate: "2026-03-31T00:00:00",
    description:
      "Sonic và đồng đội đối đầu với kẻ thù mạnh nhất - Shadow the Hedgehog.",
    director: "Jeff Fowler",
    actors: ["Ben Schwartz", "Jim Carrey", "Keanu Reeves"],
    rating: 7.5,
    status: "Sắp chiếu",
  },
  {
    id: 7,
    title: "A Complete Unknown",
    thumbnail:
      "https://play-lh.googleusercontent.com/-TaxXQGnBH2wzgo9fZGfYP5Ng4lz9XGuLLHR5l2xmQY_dRuTUX7PjK4Rfe3PzkpWlzeDlAG8erJJ-WJ8jw=w240-h480-rw",
    posterUrl:
      "https://play-lh.googleusercontent.com/-TaxXQGnBH2wzgo9fZGfYP5Ng4lz9XGuLLHR5l2xmQY_dRuTUX7PjK4Rfe3PzkpWlzeDlAG8erJJ-WJ8jw=w240-h480-rw",
    duration: 141,
    genre: "Tiểu Sử, Âm Nhạc",
    language: "Tiếng Anh",
    ageLimit: "T13",
    startDate: "2025-12-25T00:00:00",
    endDate: "2026-03-31T00:00:00",
    description:
      "Câu chuyện về Bob Dylan và cuộc cách mạng âm nhạc thập niên 1960.",
    director: "James Mangold",
    actors: ["Timothée Chalamet", "Edward Norton", "Elle Fanning"],
    rating: 8.3,
    status: "Sắp chiếu",
  },
  {
    id: 8,
    title: "Nosferatu",
    thumbnail:
      "https://www.bhdstar.vn/wp-content/uploads/2025/02/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-29.jpg",
    posterUrl:
      "https://www.bhdstar.vn/wp-content/uploads/2025/02/referenceSchemeHeadOfficeallowPlaceHoldertrueheight700ldapp-29.jpg",
    duration: 132,
    genre: "Kinh Dị, Giả Tưởng",
    language: "Tiếng Anh",
    ageLimit: "T18",
    startDate: "2025-12-25T00:00:00",
    endDate: "2026-02-28T00:00:00",
    description:
      "Phiên bản mới về truyền thuyết ma cà rồng Nosferatu đầy ám ảnh.",
    director: "Robert Eggers",
    actors: ["Bill Skarsgård", "Nicholas Hoult", "Lily-Rose Depp"],
    rating: 8.7,
    status: "Sắp chiếu",
  },
  {
    id: 9,
    title: "The Brutalist",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/vi/2/25/The_Brutalist_%28%C3%A1p_ph%C3%ADch%29.jpg",
    posterUrl:
      "https://www.mvtimes.com/mvt/uploads/2025/01/film-the-brutalist-2.jpg",
    duration: 215,
    genre: "Chính Kịch",
    language: "Tiếng Anh",
    ageLimit: "T16",
    startDate: "2025-12-27T00:00:00",
    endDate: "2026-03-31T00:00:00",
    description:
      "Hành trình của một kiến trúc sư nhập cư tại Mỹ sau Thế chiến II.",
    director: "Brady Corbet",
    actors: ["Adrien Brody", "Felicity Jones", "Guy Pearce"],
    rating: 8.9,
    status: "Sắp chiếu",
  },
];

// ============= THEATERS (2 rạp ở HCM) =============
export const mockTheaters = [
  {
    id: 1,
    name: "CGV Vincom Center",
    address: "72 Lê Thánh Tôn, Quận 1",
    city: "Hồ Chí Minh",
    rooms: [1, 2],
  },
  {
    id: 2,
    name: "Lotte Cinema Landmark",
    address: "208 Nguyễn Hữu Cảnh, Bình Thạnh",
    city: "Hồ Chí Minh",
    rooms: [3, 4],
  },
];

// ============= ROOMS (4 phòng: 2 phòng mỗi rạp) =============
export const mockRooms = [
  // CGV Vincom Center
  {
    id: 1,
    name: "Phòng 1",
    capacity: 50,
    type: "2D",
    status: "Trống",
    theaterId: 1,
  },
  {
    id: 2,
    name: "Phòng 2",
    capacity: 60,
    type: "3D",
    status: "Trống",
    theaterId: 1,
  },

  // Lotte Cinema Landmark
  {
    id: 3,
    name: "Phòng 1",
    capacity: 50,
    type: "2D",
    status: "Trống",
    theaterId: 2,
  },
  {
    id: 4,
    name: "Phòng 2",
    capacity: 60,
    type: "IMAX",
    status: "Trống",
    theaterId: 2,
  },
];

// ============= SHOWTIMES (Chỉ hôm nay + ngày mai, mỗi phòng 2 suất) =============
const today = new Date();
const generateShowtimes = () => {
  const showtimes = [];
  let id = 1;

  // 6 khung giờ trong ngày
  const timeSlots = [
    { start: "09:00:00", end: "11:15:00" },
    { start: "12:00:00", end: "14:15:00" },
    { start: "15:00:00", end: "17:15:00" },
    { start: "18:00:00", end: "20:15:00" },
    { start: "21:00:00", end: "23:15:00" },
    { start: "23:30:00", end: "01:45:00" },
  ];

  // Tạo cho 5 ngày (hôm nay + 4 ngày tới)
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    // Mỗi phòng có 4 suất chiếu/ngày
    mockRooms.forEach((room) => {
      // Chọn 4 suất ngẫu nhiên trong ngày
      const selectedSlots = [
        timeSlots[1], // 12:00
        timeSlots[2], // 15:00
        timeSlots[3], // 18:00
        timeSlots[4], // 21:00
      ];

      selectedSlots.forEach((slot, index) => {
        // Phân phim cho từng suất: luân phiên giữa các phim đang chiếu
        const availableMovies = mockMovies.filter(
          (m) => m.status === "Đang chiếu"
        );
        const movie = availableMovies[index % availableMovies.length];

        showtimes.push({
          id: id++,
          start: slot.start,
          end: slot.end,
          movieId: movie.id,
          roomId: room.id,
          date: dateStr,
          movieTitle: movie.title,
          roomName: room.name,
          theaterName: mockTheaters.find((t) => t.id === room.theaterId)?.name,
        });
      });
    });
  }

  return showtimes;
};

export const mockShowtimes = generateShowtimes();

// ============= SEATS (Chỉ 5 hàng, 10 ghế mỗi hàng = 50 ghế/phòng) =============
const generateSeats = () => {
  const seats = [];
  let id = 1;

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]; // 8 hàng
  const seatsPerRow = 6; // 6 ghế mỗi hàng để dễ nhìn

  mockRooms.forEach((room) => {
    rows.forEach((row) => {
      for (let col = 1; col <= seatsPerRow; col++) {
        let type = "Thường";
        let price = 70000;
        let isCoupleEligible = false;

        // Ghế VIP (hàng D, E, F giữa)
        if (["D", "E", "F"].includes(row) && col >= 3 && col <= 4) {
          type = "VIP";
          price = 100000;
        }

        // Ghế đôi (hàng G, H - cặp ghế liền kề)
        // Đánh dấu để hiển thị, giá đặc biệt khi chọn 2 ghế cạnh nhau
        if (["G", "H"].includes(row)) {
          isCoupleEligible = true;
          price = 75000; // Giá đặc biệt cho ghế đôi (150k/2 ghế)
        }

        seats.push({
          id: id++,
          name: `${row}${col}`,
          price: price,
          type: type,
          roomId: room.id,
          status: "Trống", // Trống, Đã đặt, Đang giữ
          isCoupleEligible: isCoupleEligible,
        });
      }
    });
  });

  return seats;
};

export const mockSeats = generateSeats();

// ============= TICKETS =============
export const mockTickets = [
  {
    id: 1,
    showtimeId: 1,
    customerId: 1,
    seatId: 45,
    roomId: 1,
    movieId: 1,
    sumOfSeat: 2,
    date: "2025-01-15",
    totalPrice: 140000,
    bookingCode: "BK001",
    status: "Đã thanh toán",
  },
];

// ============= HELPER FUNCTIONS =============

// Lấy phim theo status
export const getMoviesByStatus = (status) => {
  return mockMovies.filter((m) => m.status === status);
};

// Lấy rạp theo thành phố
export const getTheatersByCity = (city) => {
  return mockTheaters.filter((t) => t.city === city);
};

// Lấy suất chiếu theo movie + theater + date
export const getShowtimesByMovieTheaterDate = (movieId, theaterId, date) => {
  return mockShowtimes.filter((s) => {
    const room = mockRooms.find((r) => r.id === s.roomId);
    return (
      s.movieId === movieId && room?.theaterId === theaterId && s.date === date
    );
  });
};

// Lấy ghế theo phòng
export const getSeatsByRoom = (roomId) => {
  return mockSeats.filter((s) => s.roomId === roomId);
};

// Cập nhật trạng thái ghế
export const updateSeatStatus = (seatId, status) => {
  const seat = mockSeats.find((s) => s.id === seatId);
  if (seat) {
    seat.status = status;
    return true;
  }
  return false;
};

// Tạo booking mới
export const createBooking = (bookingData) => {
  const newTicket = {
    id: mockTickets.length + 1,
    ...bookingData,
    bookingCode: `BK${String(mockTickets.length + 1).padStart(3, "0")}`,
    status: "Chờ thanh toán",
  };

  mockTickets.push(newTicket);

  // Cập nhật trạng thái ghế
  if (Array.isArray(bookingData.seatIds)) {
    bookingData.seatIds.forEach((seatId) => {
      updateSeatStatus(seatId, "Đã đặt");
    });
  }

  return newTicket;
};

// Lấy thông tin đầy đủ của 1 ticket
export const getFullTicketInfo = (ticketId) => {
  const ticket = mockTickets.find((t) => t.id === ticketId);
  if (!ticket) return null;

  const showtime = mockShowtimes.find((s) => s.id === ticket.showtimeId);
  const movie = mockMovies.find((m) => m.id === ticket.movieId);
  const room = mockRooms.find((r) => r.id === ticket.roomId);
  const theater = mockTheaters.find((t) => t.id === room?.theaterId);
  const seat = mockSeats.find((s) => s.id === ticket.seatId);

  return {
    ...ticket,
    showtime,
    movie,
    room,
    theater,
    seat,
  };
};

export default {
  mockMovies,
  mockTheaters,
  mockRooms,
  mockShowtimes,
  mockSeats,
  mockTickets,
  getMoviesByStatus,
  getTheatersByCity,
  getShowtimesByMovieTheaterDate,
  getSeatsByRoom,
  updateSeatStatus,
  createBooking,
  getFullTicketInfo,
};
