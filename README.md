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

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages (Static Hosting)

Dự án đã được cấu hình sẵn để chạy trơn tru trên **GitHub Pages**:
1. Đã bật đường dẫn tương đối `base: './'` trong `vite.config.ts` (tránh lỗi màn hình trắng 404 assets).
2. Tích hợp sẵn workflow tự động build và deploy: `.github/workflows/deploy.yml`.
3. Tích hợp bộ **Client-Side Fallback Generator**: Trên GitHub Pages (vốn là hosting tĩnh không có Node.js backend), ứng dụng vẫn tự động tạo nội dung chiến dịch marketing và phân tích link URL mà không bị lỗi mạng.

### Các bước kích hoạt GitHub Pages:
1. Đẩy mã nguồn lên repository GitHub của bạn (`git push origin main`).
2. Truy cập **Settings** của repository trên GitHub.
3. Vào mục **Pages** (ở cột menu bên trái).
4. Tại phần **Build and deployment > Source**, chọn **GitHub Actions**.
5. GitHub sẽ tự động chạy quy trình `.github/workflows/deploy.yml` và cung cấp link trang web hoạt động sau khoảng 1-2 phút!

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
