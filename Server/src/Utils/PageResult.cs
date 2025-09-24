using System;
using System.Collections.Generic;

namespace Server.src.Utils
{
    // Class generic cho phân trang, có thể dùng lại cho nhiều entity (Movie, User, Order, ...)
    public class PagedResult<T>
    {
        // Danh sách item trong trang hiện tại
        public IEnumerable<T> Items { get; set; } = Array.Empty<T>();

        // Tổng số item (vd: tổng số phim)
        public int Total { get; set; }

        // Số trang hiện tại
        public int Page { get; set; }

        // Kích thước 1 trang (số item trong 1 trang)
        public int PageSize { get; set; }
    }
}
