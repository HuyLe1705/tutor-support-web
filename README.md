# BK Tutor Program - Hệ thống Hỗ trợ Tutor HCMUT

Hệ thống quản lý và hỗ trợ chương trình Tutor cho sinh viên Trường Đại học Bách Khoa - Đại học Quốc gia TP.HCM.

## 📋 Mô tả

BK Tutor Program là một ứng dụng web được xây dựng để quản lý và hỗ trợ chương trình Tutor tại HCMUT. Hệ thống cho phép sinh viên, tutor và admin quản lý các phiên học, lịch trình và thông tin cá nhân một cách hiệu quả.

## ✨ Tính năng

- 🔐 **Hệ thống đăng nhập đa dạng**
  - Đăng nhập bằng tài khoản thường
  - Đăng nhập qua SSO HCMUT (CAS)
  - Đăng nhập Admin
  - Hỗ trợ nhiều vai trò: Sinh viên, Tutor, Admin

- 📊 **Dashboard**
  - Thống kê sử dụng hệ thống
  - Biểu đồ tần suất đăng nhập
  - Thông tin lượt đăng nhập

- 📅 **Quản lý lịch trình**
  - Xem và quản lý lịch học
  - Lên lịch các phiên học

- 👥 **Quản lý phiên học**
  - Xem danh sách phiên học
  - Quản lý thông tin phiên học

- 👤 **Quản lý hồ sơ**
  - Xem và chỉnh sửa thông tin cá nhân
  - Quản lý tài khoản

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14.2.3
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React
- **Language**: JavaScript

## 📦 Cài đặt

### Yêu cầu

- Node.js 18.x trở lên
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/YOUR_USERNAME/tutor-support-web.git
cd tutor-support-web
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng ở chế độ development:
```bash
npm run dev
```

4. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

## 🚀 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build ứng dụng cho production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint để kiểm tra code

## 📁 Cấu trúc thư mục

```
tutor-support-web/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Trang dashboard
│   ├── login/             # Trang đăng nhập
│   ├── tutor/             # Trang dành cho tutor
│   └── layout.js          # Layout chính
├── components/            # React components
│   ├── Header.jsx
│   └── Sidebar.jsx
├── context/              # React Context
│   └── AuthContext.js    # Context quản lý authentication
├── data/                 # Mock data
│   └── mockData.js
└── public/               # Static files
```

## 🔑 Tài khoản demo

Để test nhanh, bạn có thể sử dụng các tài khoản sau:

- **Sinh viên**: `sv1` / `123`
- **Tutor**: `tutor1` / `123`
- **Tài khoản hỗn hợp**: `both1` / `123`

## 🌐 Routes

- `/` - Trang đăng nhập
- `/login/cas` - Đăng nhập qua SSO HCMUT
- `/login/admin` - Đăng nhập Admin
- `/dashboard` - Trang chủ dashboard
- `/dashboard/schedule` - Quản lý lịch trình
- `/dashboard/session` - Quản lý phiên học
- `/tutor/profile` - Hồ sơ tutor
- `/tutor/session` - Phiên học của tutor

## 🔒 Authentication

Hệ thống sử dụng React Context để quản lý authentication. Thông tin người dùng được lưu trong localStorage để duy trì phiên đăng nhập.

## 📝 Lưu ý

- Dự án hiện đang sử dụng mock data cho mục đích phát triển và demo
- Cần kết nối với backend API thực tế cho môi trường production
- Cần cấu hình SSO CAS thực tế cho tính năng đăng nhập HCMUT

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

Private project - Đại học Bách Khoa TP.HCM

## 👥 Tác giả

BK Tutor Program Team

---

**Trường Đại học Bách Khoa - Đại học Quốc gia TP.HCM**
```

