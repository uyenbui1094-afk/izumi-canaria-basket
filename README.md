# Izumi Canaria LA4 — CRM nội bộ V1

## Cấu trúc

- `src/App.jsx`: màn hình mặt bằng, tra mã, xem diff file rổ hàng và chọn chính sách.
- `src/data/verifiedPositions.js`: chỉ các vị trí đã được chủ dự án xác nhận; không suy luận tọa độ từ thứ tự lô.
- `src/lib/pricing.js`: cơ chế chiết khấu nhân nối tiếp và làm tròn 1.000 VNĐ.
- `src/lib/pricing.test.js`: kiểm thử unit cho công thức, làm tròn và hai trạng thái bảo lãnh.
- `MB_CANARIA_INTERACTIVE_461_LO.svg`: sơ đồ gốc được hiển thị theo tỷ lệ nguyên bản; vị trí được khai báo trong ảnh gốc 4961 × 3508.

## Excel/CSV đầu vào

App đọc sheet đầu tiên. Hỗ trợ `.xlsx`, `.xls`, `.csv`; các cột nhận diện phổ biến: `Mã sản phẩm`/`Mã căn`, `Zone`, `Dãy`/`Block`, `Số lô`, `Loại sản phẩm`, `Mã layout`, `Kích thước`, `Diện tích đất`, `Diện tích xây dựng`, `Bàn giao`, `Giá bán dự kiến`/`Giá niêm yết`. Mã hàng được đối chiếu, tạo diff và chỉ áp dụng sau xác nhận. Trạng thái nội bộ hiện có được giữ lại cho mã còn trong file. Dữ liệu rổ được lưu cục bộ trên trình duyệt (localStorage), chưa phải kho dữ liệu dùng chung nhiều sales.

## Chính sách cần xác nhận trước vận hành

Từ yêu cầu hiện có, app chỉ bật lựa chọn PTTT 1–3 cho Zone 1.1; các Zone khác bị khóa chờ cấu hình đúng theo Excel/chính sách. PTTT2 12%, gói nội thất 12% (không quy đổi tiền mặt), và bảo lãnh nhận 0%/từ chối 0,5% được đưa vào engine. Early Bird, ưu đãi sự kiện, Nam Long Club chưa có mức chiết khấu nên để khóa, không tự đặt tỷ lệ. Kết quả được đánh dấu cần đối chiếu vì chưa có bảng công thức/chính sách đầy đủ để chứng minh khớp 100% Excel.

Chỉ tâm gần đúng của `LA4-T116.18` tại `(1269,1286)` được khai báo đã xác nhận. Vì chưa có polygon lot tương ứng, app chỉ đánh dấu tâm bằng pin, không tô vùng lô. Các mã khác không tô cho tới khi mapping vị trí chính xác được xác nhận. Mặt bằng không dùng để suy ra tình trạng bán.

## Chạy và test

```sh
npm install
npm run dev
npm test
npm run build
```
