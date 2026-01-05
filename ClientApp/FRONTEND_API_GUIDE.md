# 📱 Frontend App - API Services Documentation

## 🎯 Tổng quan

Frontend app đã được tích hợp đầy đủ các API services để gọi backend ASP.NET Core Web API.

### ✅ Đã hoàn thiện

- ✅ API Configuration (`config/api.config.js`)
- ✅ Axios Client với JWT Authentication (`services/apiService.js`)
- ✅ Tất cả Services cho các nghiệp vụ chính

---

## 📂 Cấu trúc Services

```
ClientApp/
├── config/
│   └── api.config.js          # Cấu hình API endpoints
├── services/
│   ├── index.js               # Export tất cả services
│   ├── apiService.js          # Axios client
│   ├── authService.js         # Đăng nhập, xác thực
│   ├── movieService.js        # Quản lý phim
│   ├── theaterService.js      # Quản lý rạp
│   ├── showtimeService.js     # Suất chiếu
│   ├── roomService.js         # Phòng chiếu
│   ├── seatService.js         # Ghế ngồi
│   ├── bookingService.js      # Đặt vé (với Redis lock)
│   ├── ticketService.js       # Quản lý vé
│   ├── ticketPriceService.js  # Giá vé
│   ├── paymentService.js      # Thanh toán VNPay
│   ├── chatService.js         # AI Chatbot
│   ├── searchService.js       # Tìm kiếm
│   └── userService.js         # Quản lý user
```

---

## 🚀 Cách sử dụng

### 1. Import services vào component

```javascript
import { movieService, authService, bookingService } from '../services';
```

### 2. Ví dụ: Lấy danh sách phim

```javascript
import { movieService } from '../services';

const MoviesScreen = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await movieService.getAllMovies();
      setMovies(data);
    } catch (error) {
      console.error('Lỗi khi tải phim:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieCard movie={item} />}
        />
      )}
    </View>
  );
};
```

### 3. Ví dụ: Đăng nhập

```javascript
import { authService } from '../services';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await authService.login(email, password);
      
      if (result.token) {
        await login(result.token, result.userInfo);
        // Navigate to Home
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    }
  };

  return (
    <View>
      <TextInput value={email} onChangeText={setEmail} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};
```

### 4. Ví dụ: Đặt vé với Hold Seats (Phase 2)

```javascript
import { seatService, bookingService } from '../services';

const BookingScreen = ({ route }) => {
  const { showtimeId } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [holdId, setHoldId] = useState(null);

  // Bước 1: Giữ ghế tạm thời
  const handleSelectSeats = async (seats) => {
    try {
      const seatIds = seats.map(s => s.id);
      const result = await seatService.holdSeats(seatIds, showtimeId);
      
      setHoldId(result.holdId);
      setSelectedSeats(seats);
      
      Alert.alert(
        'Giữ ghế thành công',
        `Ghế đã được giữ trong ${result.ttlSeconds} giây`
      );
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  // Bước 2: Xác nhận đặt vé
  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        showtimeId,
        seatIds: selectedSeats.map(s => s.id),
        customerEmail: 'customer@example.com',
        customerPhone: '0123456789',
        holdId, // Quan trọng!
      };

      const result = await bookingService.createBooking(bookingData);
      
      Alert.alert('Thành công', 'Đặt vé thành công!');
      // Navigate to payment or confirmation
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  // Cleanup: Hủy giữ ghế khi rời màn hình
  useEffect(() => {
    return () => {
      if (holdId) {
        seatService.releaseSeats(holdId);
      }
    };
  }, [holdId]);

  return (
    <View>
      <SeatMap 
        showtimeId={showtimeId} 
        onSelectSeats={handleSelectSeats} 
      />
      <Button 
        title="Xác nhận đặt vé" 
        onPress={handleConfirmBooking}
        disabled={selectedSeats.length === 0}
      />
    </View>
  );
};
```

---

## 🔧 Cấu hình Backend URL

Thay đổi `BASE_URL` trong file [config/api.config.js](config/api.config.js):

```javascript
// Development (Windows)
export const BASE_URL = "http://localhost:5001/api";

// Development (Docker)
export const BASE_URL = "http://localhost:5000/api";

// Production
export const BASE_URL = "https://your-domain.com/api";
```

---

## 📋 Danh sách API Endpoints

### 🔐 Authentication
- `POST /Auth/login` - Đăng nhập
- `GET /Auth/me` - Lấy thông tin user hiện tại

### 🎬 Movies
- `GET /Movies/get-all-movies` - Lấy tất cả phim
- `GET /Movies/get-movie-by-id/{id}` - Lấy phim theo ID
- `POST /Movies/create-movie` - Tạo phim mới (Admin/Staff)
- `PUT /Movies/update-subject/{id}` - Cập nhật phim
- `DELETE /Movies/delete-movie/{id}` - Xóa phim

### 🏢 Theaters
- `GET /Theater/get-all-theater` - Lấy tất cả rạp
- `GET /Theater/get-theater-by-id/{id}` - Lấy rạp theo ID

### 🎞️ Showtimes
- `GET /Showtimes/get_all_showtime` - Lấy tất cả suất chiếu
- `GET /Showtimes/get-showtime-by-movieId?theaterId=&movieId=&date=` - Lấy suất chiếu theo phim

### 💺 Seats & Booking
- `GET /Seats/showtime/{showtimeId}` - Lấy ghế theo suất chiếu
- `POST /Booking/hold-seats` - Giữ ghế tạm thời (Redis lock)
- `POST /Booking/release-seats` - Hủy giữ ghế
- `POST /Booking/create` - Tạo booking (Guest)
- `POST /Booking/create-by-staff` - Tạo booking (Staff)

### 🎫 Tickets
- `POST /Ticket/book` - Đặt vé
- `GET /Ticket/customer/{email}` - Lấy vé theo email
- `POST /Ticket/cancel/{id}` - Hủy vé

### 💳 Payment
- `POST /Payment/vnpay/create` - Tạo thanh toán VNPay

### 🤖 AI Chatbot
- `POST /Chat/send` - Gửi tin nhắn cho AI

---

## ⚠️ Lưu ý quan trọng

### 1. Backend phải chạy trước
Backend phải chạy ở `http://localhost:5001` (hoặc port bạn cấu hình) trước khi frontend gọi API.

### 2. CORS đã được cấu hình
Backend đã bật CORS cho phép frontend gọi API:
```csharp
// Server/Program.cs
policy.AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader();
```

### 3. JWT Authentication
- Token được tự động thêm vào header bởi `apiService.js`
- Token được lưu trong AsyncStorage
- Token tự động xóa khi expired (401)

### 4. Error Handling
Tất cả services đều có try-catch và log errors ra console.

---

## 🧪 Test API

### Option 1: Test bằng Postman
1. Chạy backend: `cd Server && dotnet run`
2. Mở Postman
3. Import collection hoặc test từng endpoint
4. Example:
   ```
   POST http://localhost:5001/api/Auth/login
   Body: {
     "Username": "admin",
     "Password": "123456"
   }
   ```

### Option 2: Test trong app
1. Chạy backend: `cd Server && dotnet run`
2. Chạy app: `npx expo start`
3. Sử dụng các màn hình để test API

---

## 🎯 Roadmap

- [x] Setup API Configuration
- [x] Create all Services
- [x] JWT Authentication
- [x] Booking with Redis Lock (Phase 2)
- [ ] Payment Integration (VNPay)
- [ ] AI Chatbot Integration
- [ ] Real-time Notifications
- [ ] Offline Support

---

## 📞 Hỗ trợ

Nếu gặp lỗi khi gọi API:
1. Kiểm tra backend đã chạy chưa
2. Kiểm tra BASE_URL đúng chưa
3. Xem console logs để debug
4. Kiểm tra network tab trong React Native Debugger

---

**Cập nhật:** 2026-01-03
