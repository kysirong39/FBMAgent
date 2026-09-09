# 🏋️‍♂️ Trợ Lý Marketing Facebook AI (Ngành Thể Dục Thể Thao & Dụng Cụ Tập)

Ứng dụng chuyên biệt hỗ trợ chủ shop thể thao, HLV fitness, thương hiệu đồ thể thao và phòng tập Gym/Pickleball tự động tạo toàn diện chiến dịch truyền thông:
- **Mục 1:** 📝 Bài viết Facebook chuẩn công thức marketing (AIDA, PAS, FAB, FOMO, Storytelling), định dạng Markdown trực quan, nút sao chép sạch (đã dọn dấu `*` cho Facebook).
- **Mục 2:** 🎨 Kịch bản Video ngắn (Reels, TikTok, Shorts) & Prompt tạo ảnh Midjourney v6 / DALL-E 3 chuẩn thương mại.
- **Mục 3:** ⚙️ Cấu trúc JSON Payload sẵn sàng đấu nối Webhook / Facebook Graph API / Make.com / n8n.
- **Tính năng mở rộng:** Quét và tự động trích xuất thông tin sản phẩm từ Link Web / URL.

---

## 🚀 Hướng Dẫn Chạy Trên Máy Cá Nhân (Local)

### 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18+ hoặc 20+
- **npm** hoặc **yarn** / **pnpm**

### 2. Cài đặt và khởi chạy
```bash
# 1. Clone repository về máy
git clone <URL_GITHUB_CUA_BAN>
cd <thu_muc_du_an>

# 2. Cài đặt dependencies
npm install

# 3. Tạo file cấu hình môi trường .env
cp .env.example .env

# Mở file .env và điền khóa API Gemini của bạn:
# GEMINI_API_KEY=your_gemini_api_key_here

# 4. Khởi động môi trường phát triển (Dev Server)
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000`

---

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages & Khắc Phục Lỗi Chưa Thấy Link URL

Dự án đã được cấu hình sẵn để chạy trơn tru trên **GitHub Pages**:
1. Đã bật đường dẫn tương đối `base: './'` trong `vite.config.ts` (tránh lỗi màn hình trắng 404 assets).
2. Tích hợp sẵn workflow tự động build và deploy: `.github/workflows/deploy.yml`.
3. Tích hợp sẵn file `.nojekyll` và `404.html` trong `public/` giúp load assets và định tuyến SPA an toàn.
4. Tích hợp bộ **Client-Side Fallback Generator**: Trên GitHub Pages (hosting tĩnh), ứng dụng vẫn tự động tạo chiến dịch và quét link web mượt mà.

---

### ⚠️ TẠI SAO BẠN SETTING PAGES XONG NHƯNG CHƯA THẤY LINK URL WEB?

Trên GitHub, thanh thông báo màu xanh lá chứa link URL (`https://<username>.github.io/<repo-name>/`) **CHỈ XUẤT HIỆN SAU KHI TIẾN TRÌNH BUILD & DEPLOY ĐẦU TIÊN CHẠY THÀNH CÔNG**. Nếu bạn chỉ vào Settings chọn nguồn mà chưa chạy lệnh build hoặc chưa kích hoạt action, GitHub sẽ chưa có file HTML tĩnh để cấp link.

Chọn **1 trong 2 cách** đơn giản dưới đây để link xuất hiện ngay:

#### ⚡ CÁCH 1: Kích hoạt chạy GitHub Actions (Khuyên dùng - Không cần gõ lệnh)
Nếu ở **Settings > Pages**, mục **Source** bạn đã chọn là **"GitHub Actions"**:
1. Trên trang repository GitHub của bạn, bấm vào tab **"Actions"** (ở thanh menu trên cùng, cạnh tab Code / Pull requests).
2. Ở danh sách bên trái, nhấp chọn workflow: **"Deploy to GitHub Pages"**.
3. Nhìn sang góc bên phải, bấm vào nút màu xanh **"Run workflow"** > Chọn branch `main` (hoặc `master`) > Bấm nút **"Run workflow"**.
4. Chờ khoảng 1-2 phút cho đến khi workflow chạy xong và hiện dấu tích xanh **✅**.
5. Quay lại **Settings > Pages**, bạn sẽ thấy đường link web màu xanh lá xuất hiện ngay lập tức ở đầu trang!

> 💡 **Lưu ý quan trọng về quyền hạn Actions:** Nếu workflow báo lỗi quyền (Permission denied), hãy vào **Settings** > **Actions** > **General** > cuộn xuống mục **Workflow permissions** > chọn **"Read and write permissions"** > bấm **Save**.

---

#### ⚡ CÁCH 2: Dùng lệnh 1-Click `npm run deploy` (Cực kỳ nhanh & ổn định)
Dự án đã cài đặt sẵn thư viện `gh-pages` chuyên dụng cho React/Vite:
1. Mở terminal tại thư mục dự án và chạy:
   ```bash
   npm run deploy
   ```
   *(Lệnh này sẽ tự động build web vào thư mục `dist` và tự tạo nhánh `gh-pages` trên GitHub của bạn).*
2. Trên GitHub, vào **Settings > Pages**.
3. Tại mục **Build and deployment > Source**, chọn **"Deploy from a branch"**.
4. Tại mục **Branch**, chọn nhánh **`gh-pages`** và thư mục **`/(root)`** > Bấm **Save**.
5. Chỉ sau 30 giây, link URL web sẽ hiển thị ngay lập tức!

---

## ☁️ Hướng Dẫn Deploy Full-Stack (Có Backend Node.js & Gemini API)

Nếu bạn muốn ứng dụng gọi trực tiếp Gemini API trên server mà không để lộ API key ra trình duyệt:

### Deploy lên Render / Railway / Cloud Run:
- **Build command:** `npm run build`
- **Start command:** `npm start` (chạy `node dist/server.cjs`)
- **Environment Variables:**
  - `GEMINI_API_KEY`: Điền API key từ Google AI Studio
  - `PORT`: `3000` (hoặc biến môi trường do nền tảng tự cấp)

### Các lệnh npm hữu ích:
```bash
npm run dev       # Chạy dev server hỗ trợ TypeScript (tsx)
npm run build     # Build production cả frontend (dist) và backend (dist/server.cjs)
npm start         # Chạy file server đã build trong thư mục dist/server.cjs
npm run lint      # Kiểm tra TypeScript type safety
```
