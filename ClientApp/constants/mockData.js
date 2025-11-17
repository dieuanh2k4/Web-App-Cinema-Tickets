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
    distance: "2.5 km",
    description: "Rạp CGV trung tâm với phòng chiếu IMAX và 4DX hiện đại.",
    features: ["IMAX", "4DX", "Gold Class"],
    rating: 4.8,
    imageUrl: "https://images.cgv.vn/media/cgv-vincom-hn.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 1,
            movieTitle: "Người Vợ Cuối Cùng",
            posterUrl:
              "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
            genre: "Tâm Lý, Tình Cảm",
            duration: 132,
            rating: "T16",
            showtimes: [
              {
                id: "st1",
                start: "10:30",
                roomType: "IMAX",
                roomName: "IMAX 1",
                price: "180.000đ",
              },
              {
                id: "st2",
                start: "13:45",
                roomType: "Standard",
                roomName: "Phòng 2",
                price: "120.000đ",
              },
            ],
          },
          {
            movieId: 2,
            movieTitle: "Mai",
            posterUrl:
              "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
            genre: "Tâm Lý, Gia Đình",
            duration: 131,
            rating: "T13",
            showtimes: [
              {
                id: "st3",
                start: "16:15",
                roomType: "4DX",
                roomName: "4DX Hall",
                price: "210.000đ",
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
    address: "Tòa Landmark 81, Quận Bình Thạnh, TP.HCM",
    city: "TP. Hồ Chí Minh",
    distance: "1.2 km",
    description: "Rạp phim sang trọng tại tòa nhà cao nhất Việt Nam.",
    features: ["IMAX", "ScreenX", "Gold Class"],
    rating: 4.9,
    imageUrl: "https://images.cgv.vn/media/cgv-landmark-81.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 1,
            movieTitle: "Người Vợ Cuối Cùng",
            posterUrl:
              "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
            genre: "Tâm Lý, Tình Cảm",
            duration: 132,
            rating: "T16",
            showtimes: [
              {
                id: "st4",
                start: "09:30",
                roomType: "Gold Class",
                roomName: "Gold 1",
                price: "250.000đ",
              },
            ],
          },
          {
            movieId: 3,
            movieTitle: "Đất Rừng Phương Nam",
            posterUrl: "https://i.imgur.com/dA3Jf.jpg",
            genre: "Phiêu Lưu",
            duration: 120,
            rating: "T13",
            showtimes: [
              {
                id: "st5",
                start: "13:15",
                roomType: "IMAX",
                roomName: "IMAX 2",
                price: "190.000đ",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    theaterId: 3,
    name: "Galaxy Cinema Nguyễn Du",
    address: "116 Nguyễn Du, Quận 1, TP.HCM",
    city: "TP. Hồ Chí Minh",
    distance: "0.8 km",
    description: "Rạp Galaxy tại trung tâm Quận 1 với nhiều suất chiếu.",
    features: ["Dolby Atmos", "3D"],
    rating: 4.5,
    imageUrl: "https://images.galaxycine.vn/Media/galaxy-nguyen-du.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 2,
            movieTitle: "Mai",
            posterUrl:
              "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
            genre: "Tâm Lý, Gia Đình",
            duration: 131,
            rating: "T13",
            showtimes: [
              {
                id: "st6",
                start: "10:00",
                roomType: "Standard",
                roomName: "Room A",
                price: "110.000đ",
              },
            ],
          },
          {
            movieId: 3,
            movieTitle: "Đất Rừng Phương Nam",
            posterUrl: "https://i.imgur.com/dA3Jf.jpg",
            genre: "Phiêu Lưu",
            duration: 120,
            rating: "T13",
            showtimes: [
              {
                id: "st7",
                start: "13:30",
                roomType: "Premium",
                roomName: "Premium 1",
                price: "150.000đ",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    theaterId: 4,
    name: "BHD Star Huế",
    address: "50A Hùng Vương, TP. Huế",
    city: "Huế",
    distance: "3.2 km",
    description: "Rạp BHD Star đầu tiên tại miền Trung.",
    features: ["Digital 2D", "3D"],
    rating: 4.2,
    imageUrl: "https://images.bhdstar.vn/bhd-hue.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 1,
            movieTitle: "Người Vợ Cuối Cùng",
            posterUrl:
              "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
            genre: "Tâm Lý, Tình Cảm",
            duration: 132,
            rating: "T16",
            showtimes: [
              {
                id: "st8",
                start: "19:00",
                roomType: "Standard",
                roomName: "Hall 2",
                price: "100.000đ",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    theaterId: 5,
    name: "Beta Cinemas Đà Nẵng",
    address: "30 Thái Phiên, Hải Châu, Đà Nẵng",
    city: "Đà Nẵng",
    distance: "2.1 km",
    description: "Rạp Beta Cinemas trẻ trung, giá vé dễ chịu.",
    features: ["2D", "3D", "Sweetbox"],
    rating: 4.4,
    imageUrl: "https://images.betacinemas.vn/beta-danang.jpg",
    showtimes: [
      {
        date: "2025-10-30",
        movies: [
          {
            movieId: 3,
            movieTitle: "Đất Rừng Phương Nam",
            posterUrl: "https://i.imgur.com/dA3Jf.jpg",
            genre: "Phiêu Lưu",
            duration: 120,
            rating: "T13",
            showtimes: [
              {
                id: "st9",
                start: "20:30",
                roomType: "Sweetbox",
                roomName: "Sweetbox 1",
                price: "160.000đ",
              },
            ],
          },
        ],
      },
    ],
  },
];

const BASE_SEAT_TEMPLATE = [
  {
    label: "A",
    seats: [
      { code: "A1", type: "vip" },
      { code: "A2", type: "vip" },
      { code: "A3", type: "vip" },
      { code: "A4", type: "vip" },
      { code: "A5", type: "vip" },
      { code: "A6", type: "vip" },
      { code: "A7", type: "vip" },
      { code: "A8", type: "vip" },
    ],
  },
  {
    label: "B",
    seats: [
      { code: "B1", type: "vip" },
      { code: "B2", type: "vip" },
      { code: "B3", type: "vip" },
      { code: "B4", type: "vip" },
      { code: "B5", type: "vip" },
      { code: "B6", type: "vip" },
      { code: "B7", type: "vip" },
      { code: "B8", type: "vip" },
    ],
  },
  {
    label: "C",
    seats: [
      { code: "C1", type: "standard" },
      { code: "C2", type: "standard" },
      { code: "C3", type: "standard" },
      { code: "C4", type: "standard" },
      null,
      { code: "C5", type: "standard" },
      { code: "C6", type: "standard" },
      { code: "C7", type: "standard" },
      { code: "C8", type: "standard" },
    ],
  },
  {
    label: "D",
    seats: [
      { code: "D1", type: "standard" },
      { code: "D2", type: "standard" },
      { code: "D3", type: "standard" },
      { code: "D4", type: "standard" },
      null,
      { code: "D5", type: "standard" },
      { code: "D6", type: "standard" },
      { code: "D7", type: "standard" },
      { code: "D8", type: "standard" },
    ],
  },
  {
    label: "E",
    seats: [
      { code: "E1-E2", type: "couple", span: 2 },
      null,
      { code: "E3-E4", type: "couple", span: 2 },
      null,
      { code: "E5-E6", type: "couple", span: 2 },
      null,
      { code: "E7-E8", type: "couple", span: 2 },
    ],
  },
  {
    label: "F",
    seats: [
      { code: "F1", type: "standard" },
      { code: "F2", type: "standard" },
      { code: "F3", type: "standard" },
      { code: "F4", type: "standard" },
      { code: "F5", type: "standard" },
      { code: "F6", type: "standard" },
      { code: "F7", type: "standard" },
      { code: "F8", type: "standard" },
    ],
  },
];

const createSeatRows = (bookedSeats = []) =>
  BASE_SEAT_TEMPLATE.map((row) => ({
    label: row.label,
    seats: row.seats.map((seat) => {
      if (!seat) {
        return null;
      }
      return {
        ...seat,
        status: bookedSeats.includes(seat.code) ? "booked" : "available",
      };
    }),
  }));

const buildSeatLayout = ({
  showtimeId,
  theaterId,
  theaterName,
  roomName,
  screenType,
  movieId,
  movieTitle,
  posterUrl,
  genre,
  duration,
  rating,
  startTime,
  date,
  priceByType,
  bookedSeats = [],
}) => ({
  showtimeId,
  theaterId,
  theaterName,
  roomName,
  screenType,
  movieId,
  movieTitle,
  posterUrl,
  genre,
  duration,
  rating,
  startTime,
  date,
  priceByType,
  rows: createSeatRows(bookedSeats),
});

export const MOCK_SEAT_LAYOUTS = {
  st1: buildSeatLayout({
    showtimeId: "st1",
    theaterId: 1,
    theaterName: "CGV Vincom Hà Nội",
    roomName: "IMAX 1",
    screenType: "IMAX",
    movieId: 1,
    movieTitle: "Người Vợ Cuối Cùng",
    posterUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    genre: "Tâm Lý, Tình Cảm",
    duration: 132,
    rating: "T16",
    startTime: "10:30",
    date: "30/10/2025",
    priceByType: {
      standard: 120000,
      vip: 180000,
      couple: 260000,
    },
    bookedSeats: ["A3", "B4", "C5", "E5-E6"],
  }),
  st2: buildSeatLayout({
    showtimeId: "st2",
    theaterId: 1,
    theaterName: "CGV Vincom Hà Nội",
    roomName: "Phòng 2",
    screenType: "Standard",
    movieId: 1,
    movieTitle: "Người Vợ Cuối Cùng",
    posterUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    genre: "Tâm Lý, Tình Cảm",
    duration: 132,
    rating: "T16",
    startTime: "13:45",
    date: "30/10/2025",
    priceByType: {
      standard: 100000,
      vip: 150000,
      couple: 240000,
    },
    bookedSeats: ["A1", "B2", "D4", "F6"],
  }),
  st3: buildSeatLayout({
    showtimeId: "st3",
    theaterId: 1,
    theaterName: "CGV Vincom Hà Nội",
    roomName: "4DX Hall",
    screenType: "4DX",
    movieId: 2,
    movieTitle: "Mai",
    posterUrl:
      "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
    genre: "Tâm Lý, Gia Đình",
    duration: 131,
    rating: "T13",
    startTime: "16:15",
    date: "30/10/2025",
    priceByType: {
      standard: 130000,
      vip: 190000,
      couple: 280000,
    },
    bookedSeats: ["A5", "B6", "C2", "E1-E2"],
  }),
  st4: buildSeatLayout({
    showtimeId: "st4",
    theaterId: 2,
    theaterName: "CGV Landmark 81",
    roomName: "Gold 1",
    screenType: "Gold Class",
    movieId: 1,
    movieTitle: "Người Vợ Cuối Cùng",
    posterUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    genre: "Tâm Lý, Tình Cảm",
    duration: 132,
    rating: "T16",
    startTime: "09:30",
    date: "30/10/2025",
    priceByType: {
      standard: 150000,
      vip: 230000,
      couple: 320000,
    },
    bookedSeats: ["A2", "A3", "B7", "E7-E8"],
  }),
  st5: buildSeatLayout({
    showtimeId: "st5",
    theaterId: 2,
    theaterName: "CGV Landmark 81",
    roomName: "IMAX 2",
    screenType: "IMAX",
    movieId: 3,
    movieTitle: "Đất Rừng Phương Nam",
    posterUrl: "https://i.imgur.com/dA3Jf.jpg",
    genre: "Phiêu Lưu",
    duration: 120,
    rating: "T13",
    startTime: "13:15",
    date: "30/10/2025",
    priceByType: {
      standard: 110000,
      vip: 170000,
      couple: 250000,
    },
    bookedSeats: ["B1", "C3", "D6", "F2"],
  }),
  st6: buildSeatLayout({
    showtimeId: "st6",
    theaterId: 3,
    theaterName: "Galaxy Cinema Nguyễn Du",
    roomName: "Room A",
    screenType: "Standard",
    movieId: 2,
    movieTitle: "Mai",
    posterUrl:
      "https://assets.glxplay.io/images/w400/title/mai_main_poster_v6_1704788056.jpg",
    genre: "Tâm Lý, Gia Đình",
    duration: 131,
    rating: "T13",
    startTime: "10:00",
    date: "30/10/2025",
    priceByType: {
      standard: 90000,
      vip: 140000,
      couple: 220000,
    },
    bookedSeats: ["C1", "C2", "D5", "F4"],
  }),
  st7: buildSeatLayout({
    showtimeId: "st7",
    theaterId: 3,
    theaterName: "Galaxy Cinema Nguyễn Du",
    roomName: "Premium 1",
    screenType: "Premium",
    movieId: 3,
    movieTitle: "Đất Rừng Phương Nam",
    posterUrl: "https://i.imgur.com/dA3Jf.jpg",
    genre: "Phiêu Lưu",
    duration: 120,
    rating: "T13",
    startTime: "13:30",
    date: "30/10/2025",
    priceByType: {
      standard: 100000,
      vip: 160000,
      couple: 230000,
    },
    bookedSeats: ["A4", "B5", "E3-E4"],
  }),
  st8: buildSeatLayout({
    showtimeId: "st8",
    theaterId: 4,
    theaterName: "BHD Star Huế",
    roomName: "Hall 2",
    screenType: "Standard",
    movieId: 1,
    movieTitle: "Người Vợ Cuối Cùng",
    posterUrl:
      "https://images.vietnamplus.vn/Images/2023/11/07/1341341_nguoi-vo-cuoi-cung.jpg",
    genre: "Tâm Lý, Tình Cảm",
    duration: 132,
    rating: "T16",
    startTime: "19:00",
    date: "30/10/2025",
    priceByType: {
      standard: 85000,
      vip: 130000,
      couple: 200000,
    },
    bookedSeats: ["D2", "D3", "F1", "F8"],
  }),
  st9: buildSeatLayout({
    showtimeId: "st9",
    theaterId: 5,
    theaterName: "Beta Cinemas Đà Nẵng",
    roomName: "Sweetbox 1",
    screenType: "Sweetbox",
    movieId: 3,
    movieTitle: "Đất Rừng Phương Nam",
    posterUrl: "https://i.imgur.com/dA3Jf.jpg",
    genre: "Phiêu Lưu",
    duration: 120,
    rating: "T13",
    startTime: "20:30",
    date: "30/10/2025",
    priceByType: {
      standard: 95000,
      vip: 140000,
      couple: 210000,
    },
    bookedSeats: ["A6", "B8", "C7", "E1-E2"],
  }),
};

// Helper: Lấy suất chiếu theo phim
export const getShowtimesByMovieId = (movieId) => {
  return MOCK_SHOWTIMES.filter((s) =>
    NOW_PLAYING_MOVIES.find((m) => m.id === movieId && m.title === s.MovieTitle)
  );
};

export const getShowtimesByTheaterAndDate = (theaterId, selectedDate) => {
  const theater = MOCK_THEATERS.find((t) => t.theaterId === Number(theaterId));
  if (!theater) {
    return [];
  }
  const normalizedDate = new Date(selectedDate).toDateString();
  const schedule = theater.showtimes.find(
    (s) => new Date(s.date).toDateString() === normalizedDate
  );
  return schedule?.movies || [];
};
