// Mock Admin Accounts
export const adminAccounts = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    fullName: 'Thợ Săn Phú Bà',
    role: 'admin',
    email: 'admin@gmail.com',
    phone: '0901234567',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff',
    status: 'active',
    createdDate: '2024-01-01',
    lastLogin: '2024-11-18T08:30:00'
  },
  {
    id: 2,
    username: 'staff',
    password: 'staff123',
    fullName: 'Vua cua Hung Yen',
    role: 'staff',
    email: 'staff@gmail.com',
    phone: '0912345678',
    avatar: 'https://ui-avatars.com/api/?name=Staff&background=8b5cf6&color=fff',
    status: 'active',
    createdDate: '2024-02-15',
    lastLogin: '2024-11-17T15:20:00'
  },
  {
    id: 3,
    username: 'nguyenvana',
    password: 'password123',
    fullName: 'Nguyễn Văn A',
    role: 'staff',
    email: 'nguyenvana@gmail.com',
    phone: '0923456789',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=10b981&color=fff',
    status: 'active',
    createdDate: '2024-03-10',
    lastLogin: '2024-11-16T10:15:00'
  },
  {
    id: 4,
    username: 'tranthib',
    password: 'password123',
    fullName: 'Trần Thị B',
    role: 'staff',
    email: 'tranthib@gmail.com',
    phone: '0934567890',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=f59e0b&color=fff',
    status: 'active',
    createdDate: '2024-04-20',
    lastLogin: '2024-11-15T14:30:00'
  },
  {
    id: 5,
    username: 'levanc',
    password: 'password123',
    fullName: 'Lê Văn C',
    role: 'manager',
    email: 'levanc@gmail.com',
    phone: '0945678901',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=ef4444&color=fff',
    status: 'inactive',
    createdDate: '2024-05-05',
    lastLogin: '2024-10-20T09:00:00'
  },
  {
    id: 6,
    username: 'phamthid',
    password: 'password123',
    fullName: 'Phạm Thị D',
    role: 'staff',
    email: 'phamthid@gmail.com',
    phone: '0956789012',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Thi+D&background=ec4899&color=fff',
    status: 'active',
    createdDate: '2024-06-15',
    lastLogin: '2024-11-18T07:45:00'
  }
];

// Mock Movies Data - Top Anime Movies
export const movies = [
  {
    id: 1,
    title: 'Spirited Away',
    originalTitle: '千と千尋の神隠し',
    director: 'Hayao Miyazaki',
    genre: ['Animation', 'Adventure', 'Family'],
    duration: 125,
    releaseYear: 2001,
    imdbRating: 8.6,
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.',
    poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    trailer: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    status: 'showing'
  },
  {
    id: 2,
    title: 'Your Name',
    originalTitle: '君の名は',
    director: 'Makoto Shinkai',
    genre: ['Animation', 'Romance', 'Fantasy'],
    duration: 106,
    releaseYear: 2016,
    imdbRating: 8.4,
    description: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.',
    poster: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg',
    trailer: 'https://www.youtube.com/watch?v=xU47nhruN-Q',
    status: 'showing'
  },
  {
    id: 3,
    title: 'Grave of the Fireflies',
    originalTitle: '火垂るの墓',
    director: 'Isao Takahata',
    genre: ['Animation', 'Drama', 'War'],
    duration: 89,
    releaseYear: 1988,
    imdbRating: 8.5,
    description: 'A young boy and his little sister struggle to survive in Japan during World War II.',
    poster: 'https://image.tmdb.org/t/p/w500/k9tv1rXZbOhH7eiCk378x61kNQ1.jpg',
    trailer: 'https://www.youtube.com/watch?v=4vPeTSRd580',
    status: 'showing'
  },
  {
    id: 4,
    title: 'Princess Mononoke',
    originalTitle: 'もののけ姫',
    director: 'Hayao Miyazaki',
    genre: ['Animation', 'Adventure', 'Fantasy'],
    duration: 134,
    releaseYear: 1997,
    imdbRating: 8.3,
    description: 'On a journey to find the cure for a Tatarigami\'s curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.',
    poster: 'https://image.tmdb.org/t/p/w500/jHWmNr7m544fJ8eItsfNk8fs2Ed.jpg',
    trailer: 'https://www.youtube.com/watch?v=4OiMOHRDs14',
    status: 'showing'
  },
  {
    id: 5,
    title: 'A Silent Voice',
    originalTitle: '聲の形',
    director: 'Naoko Yamada',
    genre: ['Animation', 'Drama', 'Romance'],
    duration: 130,
    releaseYear: 2016,
    imdbRating: 8.1,
    description: 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.',
    poster: 'https://image.tmdb.org/t/p/w500/tuFaWiqX0TXoWu7DGNcmX3UW7sT.jpg',
    trailer: 'https://www.youtube.com/watch?v=nfK6UgLra7g',
    status: 'showing'
  },
  {
    id: 6,
    title: 'Howl\'s Moving Castle',
    originalTitle: 'ハウルの動く城',
    director: 'Hayao Miyazaki',
    genre: ['Animation', 'Adventure', 'Family'],
    duration: 119,
    releaseYear: 2004,
    imdbRating: 8.2,
    description: 'When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard and his companions in his legged, walking castle.',
    poster: 'https://image.tmdb.org/t/p/w500/TkTPELWEn6FIlKoRzKAYMQL8J6.jpg',
    trailer: 'https://www.youtube.com/watch?v=iwROgK94zcM',
    status: 'coming-soon'
  },
  {
    id: 7,
    title: 'Weathering with You',
    originalTitle: '天気の子',
    director: 'Makoto Shinkai',
    genre: ['Animation', 'Drama', 'Fantasy'],
    duration: 112,
    releaseYear: 2019,
    imdbRating: 7.5,
    description: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
    poster: 'https://image.tmdb.org/t/p/w500/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg',
    trailer: 'https://www.youtube.com/watch?v=Q6iK6DjV_iE',
    status: 'showing'
  },
  {
    id: 8,
    title: 'My Neighbor Totoro',
    originalTitle: 'となりのトトロ',
    director: 'Hayao Miyazaki',
    genre: ['Animation', 'Family', 'Fantasy'],
    duration: 86,
    releaseYear: 1988,
    imdbRating: 8.1,
    description: 'When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.',
    poster: 'https://image.tmdb.org/t/p/w500/rtGDOeG9LzoerkDGZF9dnVeLppL.jpg',
    trailer: 'https://www.youtube.com/watch?v=92a7Hj0ijLs',
    status: 'coming-soon'
  }
];

// Mock Seats - Generate for each room
export const generateSeats = (roomId) => {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return [];
  
  const seats = [];
  
  for (let row = 0; row < room.rows; row++) {
    const rowLetter = String.fromCharCode(65 + row); // A, B, C, ...
    for (let seatNum = 1; seatNum <= room.seatsPerRow; seatNum++) {
      let type = 'standard';
      if (row >= room.rows - 2) {
        type = 'vip'; // Last 2 rows are VIP
      }
      
      seats.push({
        id: `${roomId}-${rowLetter}${seatNum}`,
        roomId,
        row: rowLetter,
        number: seatNum,
        type,
        status: 'available' // available, booked, maintenance
      });
    }
  }
  
  return seats;
};

// Mock Showtimes
export const showtimes = [
  {
    id: 1,
    movieId: 1,
    roomId: 1,
    date: '2024-11-15',
    time: '10:00',
    price: 80000,
    availableSeats: 95
  },
  {
    id: 2,
    movieId: 1,
    roomId: 1,
    date: '2024-11-15',
    time: '14:00',
    price: 90000,
    availableSeats: 80
  },
  {
    id: 3,
    movieId: 2,
    roomId: 2,
    date: '2024-11-15',
    time: '16:00',
    price: 100000,
    availableSeats: 60
  },
  {
    id: 4,
    movieId: 2,
    roomId: 1,
    date: '2024-11-15',
    time: '19:00',
    price: 110000,
    availableSeats: 45
  },
  {
    id: 5,
    movieId: 3,
    roomId: 3,
    date: '2024-11-15',
    time: '20:30',
    price: 120000,
    availableSeats: 100
  },
  {
    id: 6,
    movieId: 4,
    roomId: 2,
    date: '2024-11-16',
    time: '10:30',
    price: 80000,
    availableSeats: 70
  },
  {
    id: 7,
    movieId: 5,
    roomId: 1,
    date: '2024-11-16',
    time: '13:00',
    price: 90000,
    availableSeats: 85
  },
  {
    id: 8,
    movieId: 7,
    roomId: 3,
    date: '2024-11-16',
    time: '18:00',
    price: 110000,
    availableSeats: 120
  }
];

// Mock Customers
export const customers = [
  {
    id: 'CUST001',
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    dateOfBirth: '1995-05-15',
    registeredDate: '2024-01-10',
    totalBookings: 15,
    status: 'active'
  },
  {
    id: 'CUST002',
    fullName: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0912345678',
    dateOfBirth: '1998-08-20',
    registeredDate: '2024-02-15',
    totalBookings: 8,
    status: 'active'
  },
  {
    id: 'CUST003',
    fullName: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0923456789',
    dateOfBirth: '1992-03-10',
    registeredDate: '2024-03-20',
    totalBookings: 3,
    status: 'active'
  },
  {
    id: 'CUST004',
    fullName: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0934567890',
    dateOfBirth: '2000-12-25',
    registeredDate: '2024-04-05',
    totalBookings: 12,
    status: 'active'
  }
];

// Mock Ticket Prices
// Ticket Prices based on Room Type, Seat Type, Showtime Type, and Day Type
export const ticketPrices = [
  // 2D Room
  { id: 1, roomType: '2D', seatType: 'Thường', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 50000 },
  { id: 2, roomType: '2D', seatType: 'Đôi', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 70000 },
  { id: 3, roomType: '2D', seatType: 'Vip', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 90000 },
  { id: 4, roomType: '2D', seatType: 'Thường', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 70000 },
  { id: 5, roomType: '2D', seatType: 'Đôi', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 90000 },
  { id: 6, roomType: '2D', seatType: 'Vip', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 110000 },
  
  // 3D Room
  { id: 7, roomType: '3D', seatType: 'Thường', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 70000 },
  { id: 8, roomType: '3D', seatType: 'Đôi', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 90000 },
  { id: 9, roomType: '3D', seatType: 'Vip', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 110000 },
  { id: 10, roomType: '3D', seatType: 'Thường', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 90000 },
  { id: 11, roomType: '3D', seatType: 'Đôi', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 110000 },
  { id: 12, roomType: '3D', seatType: 'Vip', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 130000 },
  
  // IMAX Room
  { id: 13, roomType: 'IMAX', seatType: 'Thường', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 90000 },
  { id: 14, roomType: 'IMAX', seatType: 'Đôi', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 110000 },
  { id: 15, roomType: 'IMAX', seatType: 'Vip', showtimeType: 'Suất chiếu sớm', dayType: 'Ngày thường', price: 130000 },
  { id: 16, roomType: 'IMAX', seatType: 'Thường', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 110000 },
  { id: 17, roomType: 'IMAX', seatType: 'Đôi', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 130000 },
  { id: 18, roomType: 'IMAX', seatType: 'Vip', showtimeType: 'Suất chiếu thường', dayType: 'Ngày cuối tuần', price: 150000 }
];

// Mock Rooms (Cinema Rooms)
export const rooms = [
  {
    id: 1,
    name: 'Phòng 1',
    type: '2D',
    totalSeats: 238,
    rows: 14,
    columns: 17,
    createdDate: '2024-01-15',
    maxSeats: 238,
    seatLayout: Array.from({ length: 14 }, (_, i) => 
      Array.from({ length: 17 }, (_, j) => ({
        row: i,
        col: j,
        type: 'standard',
        enabled: true
      }))
    )
  },
  {
    id: 2,
    name: 'Phòng 2',
    type: '2D',
    totalSeats: 150,
    rows: 12,
    columns: 13,
    createdDate: '2024-01-15',
    maxSeats: 156,
    seatLayout: Array.from({ length: 12 }, (_, i) => 
      Array.from({ length: 13 }, (_, j) => ({
        row: i,
        col: j,
        type: 'standard',
        enabled: true
      }))
    )
  },
  {
    id: 3,
    name: 'Phòng 3',
    type: '3D',
    totalSeats: 100,
    rows: 10,
    columns: 10,
    createdDate: '2024-02-01',
    maxSeats: 100,
    seatLayout: Array.from({ length: 10 }, (_, i) => 
      Array.from({ length: 10 }, (_, j) => ({
        row: i,
        col: j,
        type: 'standard',
        enabled: true
      }))
    )
  },
  {
    id: 4,
    name: 'Phòng 4',
    type: '3D',
    totalSeats: 130,
    rows: 10,
    columns: 13,
    createdDate: '2024-02-01',
    maxSeats: 130,
    seatLayout: Array.from({ length: 10 }, (_, i) => 
      Array.from({ length: 13 }, (_, j) => ({
        row: i,
        col: j,
        type: 'standard',
        enabled: true
      }))
    )
  },
  {
    id: 5,
    name: 'Phòng IMAX',
    type: 'IMAX',
    totalSeats: 200,
    rows: 15,
    columns: 14,
    createdDate: '2024-03-10',
    maxSeats: 210,
    seatLayout: Array.from({ length: 15 }, (_, i) => 
      Array.from({ length: 14 }, (_, j) => ({
        row: i,
        col: j,
        type: 'standard',
        enabled: true
      }))
    )
  }
];

// Mock Dashboard Statistics
export const dashboardStats = {
  todayRevenue: 1826000,
  newCustomers: 0,
  totalTicketsSold: 9,
  totalRevenue: 1826000,
  revenueByMonth: [
    { month: '1/2024', revenue: 45000000 },
    { month: '2/2024', revenue: 52000000 },
    { month: '3/2024', revenue: 48000000 },
    { month: '4/2024', revenue: 65000000 },
    { month: '5/2024', revenue: 78000000 }
  ],
  topMovies: [
    { movieId: 1, title: 'Spirited Away', ticketsSold: 32, revenue: 8677300 },
    { movieId: 2, title: 'Your Name', ticketsSold: 25, revenue: 6555000 },
    { movieId: 4, title: 'Princess Mononoke', ticketsSold: 26, revenue: 7791000 },
    { movieId: 5, title: 'A Silent Voice', ticketsSold: 15, revenue: 4262000 },
    { movieId: 7, title: 'Weathering with You', ticketsSold: 23, revenue: 8118000 }
  ]
};

// Mock Showtimes Schedules (Lịch chiếu)
export const showtimesSchedules = [
  {
    id: 1,
    movieId: 1,
    movieTitle: 'Spirited Away',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'active', // active, upcoming, ended
    createdDate: '2024-03-20'
  },
  {
    id: 2,
    movieId: 2,
    movieTitle: 'Your Name',
    startDate: '2024-04-15',
    endDate: '2024-05-15',
    status: 'active',
    createdDate: '2024-04-01'
  },
  {
    id: 3,
    movieId: 4,
    movieTitle: 'Princess Mononoke',
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    status: 'upcoming',
    createdDate: '2024-04-15'
  },
  {
    id: 4,
    movieId: 5,
    movieTitle: 'A Silent Voice',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'ended',
    createdDate: '2024-02-20'
  },
  {
    id: 5,
    movieId: 7,
    movieTitle: 'Weathering with You',
    startDate: '2024-04-20',
    endDate: '2024-05-20',
    status: 'active',
    createdDate: '2024-04-10'
  }
];

// Mock Showtime Slots (Suất chiếu cụ thể)
export const showtimeSlots = [
  {
    id: 1,
    movieId: 1,
    movieTitle: 'Spirited Away',
    roomId: 1,
    roomName: 'Phòng 1',
    date: '2024-04-15',
    time: '14:00',
    format: '2D', // 2D, 3D, IMAX
    version: 'subtitle', // subtitle (Phụ đề), dubbed (Lồng tiếng), voiceover (Thuyết minh)
    slotType: 'scheduled', // scheduled (Theo lịch), special (Đặc biệt), urgent (Đột xuất)
    status: 'completed', // upcoming, ongoing, completed
    createdDate: '2024-04-10'
  },
  {
    id: 2,
    movieId: 1,
    movieTitle: 'Spirited Away',
    roomId: 1,
    roomName: 'Phòng 1',
    date: '2024-04-15',
    time: '17:30',
    format: '2D',
    version: 'dubbed',
    slotType: 'scheduled',
    status: 'completed',
    createdDate: '2024-04-10'
  },
  {
    id: 3,
    movieId: 2,
    movieTitle: 'Your Name',
    roomId: 2,
    roomName: 'Phòng 2',
    date: '2024-04-20',
    time: '19:00',
    format: '3D',
    version: 'subtitle',
    slotType: 'scheduled',
    status: 'ongoing',
    createdDate: '2024-04-15'
  },
  {
    id: 4,
    movieId: 4,
    movieTitle: 'Princess Mononoke',
    roomId: 5,
    roomName: 'Phòng IMAX',
    date: '2024-05-01',
    time: '20:00',
    format: 'IMAX',
    version: 'subtitle',
    slotType: 'special',
    status: 'ongoing',
    createdDate: '2024-04-25'
  },
  {
    id: 5,
    movieId: 7,
    movieTitle: 'Weathering with You',
    roomId: 3,
    roomName: 'Phòng 3',
    date: '2024-04-21',
    time: '15:30',
    format: '3D',
    version: 'voiceover',
    slotType: 'special',
    status: 'upcoming',
    createdDate: '2024-04-20'
  },
  {
    id: 6,
    movieId: 1,
    movieTitle: 'Spirited Away',
    roomId: 4,
    roomName: 'Phòng 4',
    date: '2024-04-16',
    time: '10:00',
    format: '3D',
    version: 'subtitle',
    slotType: 'scheduled',
    status: 'completed',
    createdDate: '2024-04-10'
  },
  {
    id: 7,
    movieId: 2,
    movieTitle: 'Your Name',
    roomId: 1,
    roomName: 'Phòng 1',
    date: '2024-04-18',
    time: '21:00',
    format: '2D',
    version: 'dubbed',
    slotType: 'scheduled',
    status: 'completed',
    createdDate: '2024-04-15'
  }
];

// Mock Orders (Đơn hàng)
export const orders = [
  {
    id: '96175515',
    movieId: 1,
    movieTitle: 'Spirited Away',
    showtimeSlotId: 1,
    showtime: '14:00 - 16:05',
    date: '2024-04-15',
    roomName: 'Phòng 1 - 2D',
    roomType: '2D',
    theater: 'Cinema Complex',
    status: 'paid',
    totalAmount: 613000,
    discount: 0,
    finalAmount: 613000,
    createdDate: '2024-04-15',
    customer: {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@gmail.com'
    },
    seats: [
      { seatCode: 'A1', seatType: 'standard', price: 100000 },
      { seatCode: 'A2', seatType: 'standard', price: 100000 },
      { seatCode: 'A3', seatType: 'standard', price: 100000 }
    ],
    services: [
      { name: 'Combo Bắp Nước', quantity: 1, price: 113000 },
      { name: 'Nước Ngọt Lớn', quantity: 2, price: 50000 }
    ]
  },
  {
    id: '45341960',
    movieId: 2,
    movieTitle: 'Your Name',
    showtimeSlotId: 3,
    showtime: '19:00 - 21:05',
    date: '2024-04-20',
    roomName: 'Phòng 2 - 3D',
    roomType: '3D',
    theater: 'Cinema Complex',
    status: 'paid',
    totalAmount: 550000,
    discount: 0,
    finalAmount: 550000,
    createdDate: '2024-04-20',
    customer: {
      id: 2,
      name: 'Trần Thị B',
      phone: '0923456789',
      email: 'tranthib@gmail.com'
    },
    seats: [
      { seatCode: 'B5', seatType: 'vip', price: 150000 },
      { seatCode: 'B6', seatType: 'vip', price: 150000 }
    ],
    services: [
      { name: 'Combo Couple', quantity: 1, price: 250000 }
    ]
  },
  {
    id: '81159823',
    movieId: 4,
    movieTitle: 'Princess Mononoke',
    showtimeSlotId: 4,
    showtime: '20:00 - 22:13',
    date: '2024-05-01',
    roomName: 'Phòng IMAX - IMAX',
    roomType: 'IMAX',
    theater: 'Cinema Complex',
    status: 'paid',
    totalAmount: 400000,
    discount: 0,
    finalAmount: 400000,
    createdDate: '2024-04-25',
    customer: {
      id: 3,
      name: 'Lê Văn C',
      phone: '0934567890',
      email: 'levanc@gmail.com'
    },
    seats: [
      { seatCode: 'E10', seatType: 'standard', price: 200000 },
      { seatCode: 'E11', seatType: 'standard', price: 200000 }
    ],
    services: []
  },
  {
    id: '41709216',
    movieId: 5,
    movieTitle: 'A Silent Voice',
    showtimeSlotId: 2,
    showtime: '17:30 - 19:40',
    date: '2024-04-15',
    roomName: 'Phòng 1 - 2D',
    roomType: '2D',
    theater: 'Cinema Complex',
    status: 'cancelled',
    totalAmount: 480000,
    discount: 50000,
    finalAmount: 430000,
    createdDate: '2024-04-14',
    customer: {
      id: 4,
      name: 'Phạm Thị D',
      phone: '0945678901',
      email: 'phamthid@gmail.com'
    },
    seats: [
      { seatCode: 'F5', seatType: 'couple', price: 180000 }
    ],
    services: [
      { name: 'Combo Gia Đình', quantity: 1, price: 300000 }
    ]
  },
  {
    id: '82640126',
    movieId: 1,
    movieTitle: 'Spirited Away',
    showtimeSlotId: 6,
    showtime: '10:00 - 12:05',
    date: '2024-04-16',
    roomName: 'Phòng 4 - 3D',
    roomType: '3D',
    theater: 'Cinema Complex',
    status: 'paid',
    totalAmount: 580000,
    discount: 0,
    finalAmount: 580000,
    createdDate: '2024-04-16',
    customer: {
      id: 5,
      name: 'Hoàng Văn E',
      phone: '0956789012',
      email: 'hoangvane@gmail.com'
    },
    seats: [
      { seatCode: 'H12', seatType: 'vip', price: 180000 },
      { seatCode: 'H13', seatType: 'vip', price: 180000 }
    ],
    services: [
      { name: 'Bắp Rang Bơ', quantity: 2, price: 110000 }
    ]
  }
];
