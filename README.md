# Izumi Canaria LA4 — CRM nội bộ

V1 tập trung mặt bằng, danh sách rổ hàng, xem trước thay đổi Excel/CSV và tính giá theo những chính sách đã được xác định. Không có dữ liệu khách hàng giả.

- Mặt bằng gốc SVG được tải từ repo qua raw GitHub; có ảnh PNG dự phòng. Kích thước tọa độ gốc 4961 × 3508.
- Rổ hàng mặc định được nạp từ `Ro_hang_LA4_theo_zone_v6.xlsx`; có thể tải file mới để xem diff trước khi áp dụng.
- Dữ liệu rổ sau khi import được lưu trong localStorage của trình duyệt hiện tại.
- Chỉ tọa độ tâm `LA4-T116.18` được xác nhận. Chưa có polygon nên chỉ dùng pin, không tô vùng lô. Các mã khác không tự suy diễn vị trí.
- Chỉ Zone 1.1 mở PTTT 1–3; các Zone còn lại và các ưu đãi chưa có tỷ lệ chính thức đều khóa chờ xác nhận.
- Hệ thống áp dụng mức PTTT2 12%, gói nội thất 12%, bảo lãnh 0%/0,5% theo yêu cầu. Vì chưa có workbook công thức/chính sách đầy đủ để xác thực từng trường hợp, kết quả có cảnh báo và chưa được đảm bảo khớp 100% Excel.

Excel được đọc bằng SheetJS từ jsDelivr trong trình duyệt; cần kết nối mạng. Hỗ trợ `.xlsx`, `.xls`, `.csv`, dò tiêu đề cột thông dụng trong các sheet.
