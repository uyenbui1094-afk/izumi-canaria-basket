# TÀI LIỆU HƯỚNG DẪN ĐỊNH VỊ CHI TIẾT SỐ LÔ & VỊ TRÍ TỪNG DÃY
*(Đồng bộ 100% theo quy tắc mã Bảng Giá: `[Phân Khu].[Cụm/Block].[Số Lô]` — Ví dụ: `LA4.T116.08`)*

## 1. Quy tắc Cấu trúc Mã Lô Bảng Giá (Parsing Rules)

Mọi mã bất động sản trong Bảng giá và trên sơ đồ mặt bằng đều tuân theo định dạng chuẩn gồm **3 cấp ngăn cách bởi dấu chấm (`.`)**:

$$
\text{Mã Lô Chuẩn} = [\text{Mã Khu / Phân Khu}] \mathbf{.} [\text{Mã Cụm / Dãy}] \mathbf{.} [\text{Số Thứ Tự Lô}]
$$

### Ví dụ bóc tách thực tế từ mã `LA4.T116.08`:
1. **Cấp 1 — Mã Khu / Phân Khu (`LA4`):** Xác định phân khu lớn trên tổng mặt bằng (ví dụ: Khu LA4). Agent dùng mã này để khoanh vùng đúng bản đồ phân khu cần tra cứu.
2. **Cấp 2 — Mã Cụm / Dãy (`T116`):** Xác định chính xác cụm nhà hoặc block/dãy bên trong phân khu `LA4` (ví dụ: Cụm/Block `T116`).
3. **Cấp 3 — Số Thứ Tự Lô (`08`):** Xác định vị trí lô đất/căn nhà cụ thể nằm trong cụm `T116` (lô số `08`).

### Quy tắc chuẩn hóa khi Agent đọc dữ liệu:
* **Dấu phân cách:** Bắt buộc dùng dấu chấm `.` để tách 3 cấp dữ liệu. Nếu người dùng gõ thiếu dấu chấm hoặc dùng dấu gạch ngang (ví dụ: `LA4 T116 08` hoặc `LA4-T116-8`), Agent tự động chuẩn hóa về dạng `LA4.T116.08` trước khi tra cứu.
* **Định dạng 2 chữ số cho Số Lô:** Số thứ tự lô luôn giữ đủ 2 chữ số (ví dụ: `01`, `02`, ..., `08`, `12`).

---

## 2. Nguyên tắc "Bảng Giá Là Gốc" (Single Source of Truth)

1. **Khớp mã 1-1:** Mã lô trên bản vẽ mặt bằng phải khớp tuyệt đối với cột `Mã căn / Mã lô` trong Bảng giá (ví dụ `LA4.T116.08`).
2. **Xác nhận đặc tính vị trí:** Agent dựa vào thông tin đi kèm mã `LA4.T116.08` trong Bảng giá (Diện tích, Hướng, Loại lô: *Lô thường / Lô góc / Lô khe kỹ thuật / Mặt tiền đường chính*) để kết luận đặc điểm lô, không tự suy đoán sai lệch với bảng giá.
3. **Giới hạn số lượng lô trong cụm:** Tổng số lô của một cụm (ví dụ `T116`) được xác định bằng số thứ tự lô lớn nhất (`Max`) của cụm đó xuất hiện trong Bảng giá.

---

## 3. Cấu trúc Dữ liệu Ánh Xạ (Bảng Giá $\leftrightarrow$ Mặt Bằng)

Agent sử dụng cấu trúc dữ liệu phân cấp 3 tầng dưới đây để định vị chính xác từng lô trong từng cụm:

```json
{
  "zone_id": "LA4",
  "zone_name": "Phân khu LA4",
  "clusters": [
    {
      "cluster_id": "T116",
      "full_prefix": "LA4.T116",
      "street_front": "Đường nội khu số 12 (Lộ giới 13m)",
      "orientation": "Đông Nam",
      "total_lots": 16,
      "numbering_direction": "Trái sang Phải (nhìn từ mặt đường vào)",
      "lots": [
        {
          "full_code": "LA4.T116.01",
          "lot_number": "01",
          "position_type": "Lô góc 2 mặt tiền",
          "neighbors": {
            "left": "Đường giao cắt (Góc ngã tư)",
            "right": "LA4.T116.02",
            "back": "LA4.T116.16"
          },
          "coordinates_norm": { "x": 0.210, "y": 0.450 }
        },
        {
          "full_code": "LA4.T116.08",
          "lot_number": "08",
          "position_type": "Lô thường giữa cụm",
          "neighbors": {
            "left": "LA4.T116.07",
            "right": "LA4.T116.09",
            "back": "LA4.T116.09 (hoặc lô đối lưng theo mặt bằng)"
          },
          "coordinates_norm": { "x": 0.385, "y": 0.450 }
        }
      ]
    }
  ]
}
```

---

## 4. Quy tắc Định vị Cụm & Số Lô trên Mặt Bằng

### 4.1. Định vị theo từng cấp từ ngoài vào trong (Top-Down)
Khi định vị một mã như `LA4.T116.08`, Agent thực hiện tuần tự 3 bước:
* **Bước 1 (Tìm Khu `LA4`):** Khoanh vùng toàn bộ phân khu `LA4` trên tổng mặt bằng dự án, xác định các trục đường bao quanh khu `LA4`.
* **Bước 2 (Tìm Cụm `T116`):** Bên trong phân khu `LA4`, xác định vị trí của block/cụm `T116` (nằm ở rìa khu, trung tâm khu, gần công viên hay trục đường chính nào).
* **Bước 3 (Tìm Lô `08` trong cụm `T116`):**
  * **Lô đầu cụm (`01`):** Nằm tại điểm khởi đầu đánh số của cụm `T116` (thường là lô góc giao lộ).
  * **Lô giữa cụm (như `08`):** Nằm chính giữa lô liền trước (`LA4.T116.07`) và lô liền sau (`LA4.T116.09`).
  * **Lô cuối cụm (`N`):** Nằm ở điểm kết thúc của cụm `T116` theo danh sách Bảng giá.

### 4.2. Quy tắc nhận diện cấu trúc Cụm (`T...`)
* **Nếu Cụm là 1 dãy đơn (Single Row):** Các lô chạy một mạch từ `01` đến `N` cùng nhìn về một hướng đường.
* **Nếu Cụm là 1 block khép kín 2 mặt tiền (Back-to-Back Block):** Các lô chạy vòng quanh cụm (ví dụ: mặt trước từ `01` đến `08`, vòng qua góc sang mặt sau từ `09` đến `16`). Khi đó, Agent cần kiểm tra điểm gập góc trong Bảng giá (các lô được ghi chú *Lô góc* ở giữa dãy số) để biết chính xác lô nào nằm ở mặt tiền nào của cụm `T116`.

### 4.3. Xác định Trái / Phải theo góc nhìn thực tế
Luôn tính theo **hướng người đứng dưới lòng đường nhìn thẳng vào mặt tiền của lô đất**:
* **Mặt tiền hướng Nam:** Bên trái là lô hướng Tây, bên phải là lô hướng Đông.
* **Mặt tiền hướng Bắc:** Bên trái là lô hướng Đông, bên phải là lô hướng Tây.
* **Mặt tiền hướng Đông:** Bên trái là lô hướng Nam, bên phải là lô hướng Bắc.
* **Mặt tiền hướng Tây:** Bên trái là lô hướng Bắc, bên phải là lô hướng Nam.

---

## 5. Bảng Tra Cứu Nhanh Các Cụm Thuộc Phân Khu (Mẫu điền dữ liệu)

*(Điền danh sách các cụm từ Bảng giá của bạn vào bảng này để Agent định vị tức thì)*

| Phân Khu | Mã Cụm | Tiền Tố Mã Lô | Dải Số Lô (Bảng Giá) | Các Lô Góc Trong Cụm | Vị Trí Tuyến Đường / Tiện Ích Tiếp Giáp |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LA4** | **T116** | `LA4.T116.` | `01` $\rightarrow$ `16` | `01`, `08`, `09`, `16` *(Ví dụ)* | Mặt trước đường N1, mặt sau đường N2 |
| **LA4** | **T117** | `LA4.T117.` | `01` $\rightarrow$ `20` | `01`, `10`, `11`, `20` | Đối diện công viên nội khu LA4 |
| **LA5** | **T118** | `LA5.T118.` | `01` $\rightarrow$ `12` | `01`, `12` | Trục đường chính 24m |

---

## 6. Prompt Chỉ Thị Dành Riêng Cho Agent Định Vị

> *"Khi nhận được yêu cầu tìm vị trí bất kỳ mã lô nào (ví dụ: `LA4.T116.08`):*
> 1. *Tách mã thành 3 phần: **Phân khu (`LA4`)** $\rightarrow$ **Cụm (`T116`)** $\rightarrow$ **Số lô (`08`)**.*
> 2. *Đối chiếu mã đầy đủ `LA4.T116.08` trong **Bảng Giá** để lấy thông số chuẩn (diện tích, hướng, loại lô góc/thường).*
> 3. *Dựa vào `lot_location_guide.md` để mô tả rõ cho khách hàng: Lô `08` nằm ở vị trí nào trong cụm `T116` (đầu cụm, giữa cụm hay góc cụm), kẹp giữa 2 lô nào (`07` và `09`), thuộc phân khu `LA4` và tiếp giáp trục đường/tiện ích gì."*