// src/data/mockData.js

// Danh sách phim (NOW PLAYING)
export const NOW_PLAYING_MOVIES = [
  {
    id: 1,
    title: "Người Vợ Cuối Cùng",
    genre: "Tâm Lý, Tình Cảm",
    duration: 132,
    rating: "8.5",
    posterUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    backdropUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    description:
      "Câu chuyện cảm động về tình yêu, sự hy sinh và những giá trị gia đình truyền thống.",
    director: "Đạo diễn Trần Thanh Hùng",
    cast: "Minh Hương, Trung Dũng, Thanh Thúy",
    country: "Việt Nam",
    language: "Tiếng Việt",
  },
  {
    id: 2,
    title: "Mai",
    genre: "Tâm Lý, Gia Đình",
    duration: 131,
    rating: "9.1",
    posterUrl:
      "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
    backdropUrl:
      "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
    description:
      "Một câu chuyện gia đình đầy cảm động về tình mẫu tử, sự hy sinh và những giá trị nhân văn.",
    director: "Đạo diễn Trần Đức Long",
    cast: "Phương Oanh, Tuấn Trần, Ngọc Lan",
    country: "Việt Nam",
    language: "Tiếng Việt",
  },
  {
    id: 3,
    title: "Đất Rừng Phương Nam",
    genre: "Phiêu Lưu",
    duration: 120,
    rating: "7.8",
    posterUrl: "https://i.imgur.com/dA3Jf.jpg",
    backdropUrl: "https://i.imgur.com/dA3Jf.jpg",
    description:
      "Cuộc phiêu lưu đầy thú vị qua những vùng đất hoang sơ của miền Nam.",
    director: "Đạo diễn Lê Hoàng",
    cast: "Đức Thịnh, Hồng Ánh, Minh Thư",
    country: "Việt Nam",
    language: "Tiếng Việt",
  },
];

// Danh sách phim sắp chiếu (UPCOMING)
export const UPCOMING_MOVIES = [
  {
    id: 4,
    title: "Giao Lộ 8675",
    genre: "Hành Động, Tình Cảm",
    duration: 128,
    rating: "8.2",
    releaseDate: "25/01/2025",
    posterUrl: "https://i.imgur.com/abc123.jpg",
    backdropUrl: "https://i.imgur.com/abc123.jpg",
    description:
      "Một câu chuyện hành động đầy kịch tính với những cảnh đánh nhau mãn nhãn.",
    director: "Đạo diễn Nguyễn Quang Dũng",
    cast: "Johnny Trí Nguyễn, Ngô Thanh Vân, Lý Hùng",
    country: "Việt Nam",
    language: "Tiếng Việt",
  },
  {
    id: 5,
    title: "Aquaman: Đế Vương Atlantis",
    genre: "Hành Động, Phiêu Lưu",
    duration: 124,
    rating: "7.9",
    releaseDate: "01/02/2025",
    posterUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/a/q/aquaman_and_the_lost_kingdom_-_digital_paid_1_.jpg",
    backdropUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/a/q/aquaman_and_the_lost_kingdom_-_digital_paid_1_.jpg",
    description:
      "Cuộc phiêu lưu dưới đại dương của Aquaman trong hành trình bảo vệ vương quốc Atlantis.",
    director: "James Wan",
    cast: "Jason Momoa, Amber Heard, Willem Dafoe",
    country: "Mỹ",
    language: "Tiếng Anh",
  },
  {
    id: 6,
    title: "Wonka",
    genre: "Phiêu Lưu, Thần Thoại",
    duration: 116,
    rating: "8.7",
    releaseDate: "15/02/2025",
    posterUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/w/o/wonka_final_main_poster_1_.jpg",
    backdropUrl:
      "https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/w/o/wonka_final_main_poster_1_.jpg",
    description:
      "Câu chuyện về tuổi thơ của Willy Wonka, người tạo ra nhà máy sô-cô-la huyền thoại.",
    director: "Paul King",
    cast: "Timothée Chalamet, Olivia Colman, Hugh Grant",
    country: "Anh",
    language: "Tiếng Anh",
  },
];

// Mock data cho ShowtimeDto (đúng cấu trúc backend)
export const MOCK_SHOWTIMES = [
  // Phim 1: Người Vợ Cuối Cùng
  {
    Id: 1,
    Start: new Date("2025-10-28T14:00:00"),
    End: new Date("2025-10-28T16:12:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Người Vợ Cuối Cùng",
    RoomType: "2D",
    RooomName: "Phòng 1", // Lỗi typo từ backend → vẫn giữ để đồng bộ
    TheaterName: "CGV Vincom Hà Nội",
  },
  {
    Id: 2,
    Start: new Date("2025-10-28T17:30:00"),
    End: new Date("2025-10-28T19:42:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Người Vợ Cuối Cùng",
    RoomType: "3D",
    RooomName: "Phòng 2",
    TheaterName: "CGV Vincom Hà Nội",
  },
  {
    Id: 3,
    Start: new Date("2025-10-28T15:00:00"),
    End: new Date("2025-10-28T17:12:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Người Vợ Cuối Cùng",
    RoomType: "2D",
    RooomName: "Phòng A",
    TheaterName: "Lotte Cinema TP.HCM",
  },

  // Phim 2: Mai
  {
    Id: 4,
    Start: new Date("2025-10-28T13:00:00"),
    End: new Date("2025-10-28T15:11:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Mai",
    RoomType: "2D",
    RooomName: "Phòng 3",
    TheaterName: "Galaxy Nguyễn Du",
  },
  {
    Id: 5,
    Start: new Date("2025-10-28T18:00:00"),
    End: new Date("2025-10-28T20:11:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Mai",
    RoomType: "IMAX",
    RooomName: "Phòng VIP",
    TheaterName: "CGV Vincom Hà Nội",
  },

  // Phim 3: Đất Rừng Phương Nam
  {
    Id: 6,
    Start: new Date("2025-10-28T16:00:00"),
    End: new Date("2025-10-28T18:00:00"),
    Date: new Date("2025-10-28"),
    MovieTitle: "Đất Rừng Phương Nam",
    RoomType: "2D",
    RooomName: "Phòng 4",
    TheaterName: "Beta Cinemas Đà Nẵng",
  },
];

export const CITIES = ["TP. Hồ Chí Minh", "Hà Nội", "Huế", "Đà Nẵng"];

export const MOCK_THEATERS = [
  {
    theaterId: 1,
    name: "CGV Vincom Hà Nội",
    address: "Số 2 Phạm Ngọc Thạch, Đống Đa, Hà Nội",
    city: "Hà Nội",
    distance: "2.5km", // Giả sử từ vị trí user
    imageUrl: "https://example.com/cgv-hanoi.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 1,
            movieTitle: "Người Vợ Cuối Cùng",
            showtimes: [
              {
                id: "st1",
                start: "10:30",
                roomType: "IMAX",
                price: "180.000đ",
                seatsAvailable: 45,
              },
              {
                id: "st2",
                start: "13:45",
                roomType: "Standard",
                price: "120.000đ",
                seatsAvailable: 60,
              },
              {
                id: "st3",
                start: "16:15",
                roomType: "4DX",
                price: "200.000đ",
                seatsAvailable: 30,
              },
            ],
          },
          {
            movieId: 2,
            movieTitle: "Mai",
            showtimes: [
              {
                id: "st4",
                start: "11:00",
                roomType: "Standard",
                price: "120.000đ",
                seatsAvailable: 55,
              },
              {
                id: "st5",
                start: "14:30",
                roomType: "IMAX",
                price: "180.000đ",
                seatsAvailable: 40,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    theaterId: 2,
    name: "CGV Landmark 81",
    cityId: 1,
    address: "Landmark 81, Quận Bình Thạnh, TP.HCM",
    description: "Rạp phim sang trọng tại tòa nhà cao nhất Việt Nam",
    features: ["IMAX", "Gold Class", "ScreenX"],
    rating: 4.8,
    facilities: ["Parking", "Restaurant", "VIP Lounge", "Gaming Zone"],
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 1,
            movieTitle: "Người Vợ Cuối Cùng",
            showtimes: [
              {
                id: "st6",
                start: "09:30",
                roomType: "Gold Class",
                price: "250.000đ",
                seatsAvailable: 20,
              },
              {
                id: "st7",
                start: "12:45",
                roomType: "IMAX",
                price: "180.000đ",
                seatsAvailable: 50,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    theaterId: 3,
    name: "BHD Star Vincom Thảo Điền",
    cityId: 1,
    address: "Vincom Thảo Điền, Quận 2, TP.HCM",
    description: "Chuỗi rạp BHD Star cao cấp",
    features: ["Dolby Atmos", "Digital 2D/3D"],
    rating: 4.3,
    facilities: ["Parking", "Snack Bar"],
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 2,
            movieTitle: "Mai",
            showtimes: [
              {
                id: "st8",
                start: "10:00",
                roomType: "Standard",
                price: "120.000đ",
                seatsAvailable: 65,
              },
              {
                id: "st9",
                start: "13:15",
                roomType: "Premium",
                price: "150.000đ",
                seatsAvailable: 35,
              },
            ],
          },
        ],
      },
    ],
  },
];

// Helper: Lấy suất chiếu theo phim
export const getShowtimesByMovieId = (movieId) => {
  return MOCK_SHOWTIMES.filter((s) =>
    NOW_PLAYING_MOVIES.find((m) => m.id === movieId && m.title === s.MovieTitle)
  );
};

export const getShowtimesByTheaterAndDate = (theaterId, selectedDate) => {
  const theater = MOCK_THEATERS.find((t) => t.theaterId === theaterId);
  return (
    theater?.showtimes.find(
      (s) => s.date.toDateString() === selectedDate.toDateString()
    )?.movies || []
  );
};
