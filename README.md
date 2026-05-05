# TỔNG QUAN ĐỀ TÀI

## 1.1 Bối cảnh đề tài

Trong những năm gần đây, ngành công nghiệp điện ảnh tại Việt Nam và thế giới đã có những bước chuyển mình mạnh mẽ với sự ra đời của hàng loạt cụm rạp hiện đại và các tác phẩm điện ảnh chất lượng cao. Đi cùng với đó là xu hướng chuyển đổi số trong mọi lĩnh vực đời sống.

Chính vì vậy, việc xây dựng một ứng dụng web đặt vé xem phim hiện đại và thân thiện là nhu cầu cấp thiết để kết nối hiệu quả giữa rạp phim và khán giả.

## 1.2 Mục đích của đề tài

Đề tài được thực hiện nhằm đạt được các mục tiêu chính sau:

**Về mặt kỹ thuật:**

- Xây dựng một hệ thống Web App hoàn chỉnh, đảm bảo tính ổn định, bảo mật thông tin người dùng và khả năng mở rộng trong tương lai.
- Ứng dụng các công nghệ hiện đại để tối ưu hóa hiệu suất hệ thống.

**Về mặt trải nghiệm:**

- Tối ưu hóa quy trình đặt vé (chọn phim → chọn suất chiếu → chọn ghế → thanh toán) chỉ trong vòng chưa đầy 2 phút, giúp nâng cao sự hài lòng của khách hàng.

**Về mặt quản lý:**

- Cung cấp công cụ quản trị mạnh mẽ giúp nhà rạp quản lý lịch chiếu, doanh thu, thông tin phim và khách hàng một cách tự động và chính xác, giảm thiểu sai sót do thao tác thủ công.

## 1.3 Phạm vi của đề tài

Dự án tập trung xây dựng và tối ưu hóa các phân hệ chức năng cốt lõi sau đây:

### Phân hệ phía người dùng (Client)

- Xem danh sách phim đang chiếu/sắp chiếu và thông tin chi tiết từng bộ phim.
- Tìm kiếm và lọc phim thông minh theo thể loại, rạp và khung giờ.
- Đặt vé trực tuyến: Hỗ trợ chọn chỗ ngồi theo thời gian thực (Real-time), đảm bảo tính đồng bộ dữ liệu.
- Thanh toán trực tuyến tích hợp và quản lý lịch sử giao dịch cá nhân.

### Phân hệ phía quản trị (Admin)

- Quản lý danh mục phim, cấu hình phòng chiếu và sơ đồ ghế ngồi linh hoạt.
- Thiết lập, điều chỉnh lịch chiếu và giá vé theo từng khung giờ/định dạng phim.
- Quản lý người dùng của hệ thống bao gồm các admin, nhân viên và khách hàng.
- Hệ thống thống kê báo cáo doanh thu trực quan thông qua biểu đồ tăng trưởng.

**Giới hạn phạm vi:**

- Dự án tập trung phát triển trên nền tảng Web App với thiết kế đáp ứng (Responsive Design), đảm bảo trải nghiệm đồng nhất trên cả trình duyệt máy tính và thiết bị di động.

## 1.4 Đối tượng của đề tài

Đề tài hướng tới ba nhóm đối tượng chính với những đặc thù và nhu cầu riêng biệt:

### Người sử dụng dịch vụ (Khách hàng)

- Những người yêu thích điện ảnh và thường xuyên cập nhật các xu hướng phim mới.
- Nhóm người dùng trẻ, có thói quen sử dụng công nghệ và thiết bị di động hàng ngày.
- Đòi hỏi sự tiện lợi, nhanh chóng và minh bạch trong quy trình chọn chỗ ngồi cũng như thanh toán trực tuyến.

### Quản trị viên (Admin)

- Các cụm rạp hoặc đơn vị phát hành phim cần một công cụ quản trị số hóa chuyên nghiệp.
- Mong muốn tối ưu hóa quy trình vận hành, giảm tải áp lực tại quầy vé truyền thống.
- Cần các số liệu báo cáo chính xác để phân tích hành vi khách hàng và nâng cao doanh số bán vé trực tuyến.

### Nhân viên bán vé và kiểm soát (Staff)

- Nhân viên tại quầy cần công cụ để thao tác xuất vé nhanh cho khách mua trực tiếp.
- Thực hiện nhiệm vụ kiểm tra, xác thực mã vé (QR Code/ID) từ khách hàng đặt trực tuyến.
- Theo dõi tình trạng ghế trống trong phòng chiếu để hỗ trợ khách hàng tại chỗ một cách kịp thời và chính xác.

---

# QUY TẮC NGHIỆP VỤ

## 2.4 Quy tắc nghiệp vụ chính

### 2.5.1 Chức năng cho khách hàng

#### (a) Đăng nhập và đăng ký

- Người dùng cung cấp thông tin cơ bản (email, họ tên, mật khẩu) để đăng ký tài khoản.
- Đăng nhập bằng email và mật khẩu.
- Hỗ trợ khôi phục, đổi mật khẩu thông qua xác thực email.

#### Tìm kiếm và xem thông tin phim

- Người dùng có thể tìm kiếm phim theo tên, thể loại, diễn viên, đạo diễn...
- Hiển thị thông tin chi tiết của phim: tóm tắt nội dung, danh sách diễn viên, đạo diễn, thời lượng, trailer và đánh giá.
- Cung cấp lịch chiếu chi tiết theo khung giờ và ngày cụ thể.

#### Đặt vé

- Người dùng chọn phim, rạp, suất chiếu và ghế ngồi thông qua giao diện trực quan (hiển thị sơ đồ ghế với trạng thái: trống, đang chọn, đã đặt).
- Hỗ trợ chọn dịch vụ đi kèm (bỏng ngô, nước uống, các gói combo).
- Hiển thị tổng giá vé rõ ràng trước khi xác nhận.
- Thanh toán qua cổng thanh toán trực tuyến (VNPay, thẻ ngân hàng, ví điện tử).
- Sau khi thanh toán thành công, hệ thống gửi thông tin vé qua email hoặc lưu trong tài khoản dưới dạng mã QR code để check-in tại rạp.

#### Bảo mật thông tin

- Đảm bảo an toàn dữ liệu cá nhân (tên, số điện thoại, thông tin thanh toán) trong suốt quá trình giao dịch.

### 2.5.2 Chức năng dành cho quản trị viên (Admin)

#### Quản lý phim và lịch chiếu

- Thêm, sửa, xóa thông tin phim (tên, thể loại, thời lượng, diễn viên, đạo diễn, trailer).
- Thiết lập và cập nhật lịch chiếu theo phòng chiếu và giờ chiếu cụ thể.

#### Quản lý giá vé

- Cập nhật giá vé linh hoạt theo loại ghế và thời điểm (ngày lễ, giờ cao điểm).
- Tự động tính toán giá dựa trên số lượng vé hoặc các chương trình khuyến mại hiện có.

#### Quản lý đơn hàng

- Xem chi tiết các đơn hàng đã thực hiện: thông tin vé, dịch vụ đi kèm và tổng doanh thu đơn hàng.

#### Báo cáo thống kê

- Thống kê doanh thu theo ngày, tháng, năm hoặc theo từng đầu phim.
- Báo cáo số lượng khách hàng mới, số lượng vé bán ra và lượt xem phim.

#### Quản lý tài khoản

- Phân quyền người dùng theo các vai trò: Admin, nhân viên rạp, khách hàng.
- Kiểm tra và quản lý trạng thái tài khoản thành viên (kích hoạt hoặc khóa tài khoản).

#### Quản lý phim, phòng chiếu, ghế ngồi

- **Cơ sở dữ liệu:** Lưu trữ tập trung thông tin phim và cấu trúc vật lý của phòng chiếu.
- **Quản lý ghế ngồi:** Quản lý chi tiết theo hàng, số ghế và trạng thái khả dụng.

#### Quy tắc ràng buộc

- Ghế đã được đặt hoặc đang trong quá trình thanh toán không thể được chọn bởi người dùng khác.
- Hệ thống tự động cập nhật trạng thái ghế ngay sau khi giao dịch hoàn tất hoặc hết thời gian giữ chỗ.

## 2.6 Quy trình xử lý nghiệp vụ

### 2.6.1 Quy trình đặt vé trực tuyến

Quy trình đặt vé được thực hiện qua các bước trình tự sau nhằm đảm bảo tính chính xác và giữ chỗ cho khách hàng:

#### (a) Đăng nhập hệ thống

Người dùng đăng nhập vào tài khoản cá nhân. Trong trường hợp chưa có tài khoản, người dùng cần thực hiện bước đăng ký để tiếp hành đặt vé.

#### (b) Lựa chọn phim và suất chiếu

Người dùng tìm kiếm phim theo nhu cầu, sau đó lựa chọn rạp chiếu và suất chiếu phù hợp.

#### (c) Chọn chỗ ngồi

Hệ thống hiển thị sơ đồ ghế ngồi trực quan với các trạng thái: trống, đã đặt, đang được chọn. Người dùng thực hiện chọn ghế sau đó nhấn nút "Đặt vé".

#### (d) Giữ chỗ tạm thời

Hệ thống thực hiện giữ ghế đã chọn trong một khoảng thời gian quy định (ví dụ: 5 phút) để người dùng hoàn tất thủ tục thanh toán.

#### (e) Thanh toán trực tuyến

Hệ thống xác nhận lại thông tin vé và chuyển hướng người dùng đến cổng thanh toán online.

#### (f) Xác nhận thành công

Khi giao dịch thanh toán thành công, thông tin vé dưới dạng mã QR code sẽ được gửi qua email và lưu trữ trực tiếp trên ứng dụng để khách hàng sử dụng khi check-in.

### 2.6.2 Quy trình quản lý

Quy trình dành cho quản trị viên nhằm đảm bảo hệ thống luôn được cập nhật dữ liệu mới nhất và vận hành ổn định:

#### (a) Cập nhật dữ liệu

Admin thực hiện cập nhật thông tin phim mới, thiết lập lịch chiếu và điều chỉnh bảng giá vé cho các khung giờ khác nhau.

#### (b) Xử lý dữ liệu tự động

Hệ thống tự động ghi nhận các giao dịch, tính toán doanh thu thực tế và lưu trữ dữ liệu vào cơ sở dữ liệu tập trung.

#### (c) Giám sát và Tối ưu

Admin theo dõi các báo cáo thống kê định kỳ, từ đó đưa ra các điều chỉnh về giá vé hoặc thiết lập các chương trình khuyến mại để tối ưu hóa doanh thu.
