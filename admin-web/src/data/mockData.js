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

// Mock Orders
export const orders = [
  {
    id: 'ORD001',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    movieId: 1,
    showtimeId: 2,
    seats: ['A5', 'A6'],
    totalAmount: 180000,
    status: 'completed',
    paymentMethod: 'vnpay',
    bookingDate: '2024-11-14T10:30:00',
    qrCode: 'QR001'
  },
  {
    id: 'ORD002',
    customerId: 'CUST002',
    customerName: 'Trần Thị B',
    movieId: 2,
    showtimeId: 3,
    seats: ['B8', 'B9', 'B10'],
    totalAmount: 300000,
    status: 'completed',
    paymentMethod: 'momo',
    bookingDate: '2024-11-14T14:20:00',
    qrCode: 'QR002'
  },
  {
    id: 'ORD003',
    customerId: 'CUST003',
    customerName: 'Lê Văn C',
    movieId: 2,
    showtimeId: 4,
    seats: ['C5'],
    totalAmount: 110000,
    status: 'pending',
    paymentMethod: 'card',
    bookingDate: '2024-11-15T08:15:00',
    qrCode: 'QR003'
  },
  {
    id: 'ORD004',
    customerId: 'CUST004',
    customerName: 'Phạm Thị D',
    movieId: 3,
    showtimeId: 5,
    seats: ['D1', 'D2'],
    totalAmount: 240000,
    status: 'completed',
    paymentMethod: 'vnpay',
    bookingDate: '2024-11-15T09:45:00',
    qrCode: 'QR004'
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
