# 🎓 Smart Student Manager

Ứng dụng quản lý sinh viên thông minh được xây dựng với Next.js, TypeScript, TailwindCSS và Firebase.

![Smart Student Manager](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## 📋 Tính năng

### Hệ thống phân quyền
| Vai trò | Quản lý sinh viên | Quản lý giáo viên | Phân quyền người dùng |
|---------|-------------------|-------------------|----------------------|
| **Admin** | ✅ Toàn quyền | ✅ Toàn quyền | ✅ Toàn quyền |
| **Giáo viên** | ✅ Toàn quyền | ❌ Không có | ❌ Không có |
| **User** | 👁️ Chỉ xem | ❌ Không có | ❌ Không có |

### Chức năng chính
- **Authentication**: Đăng nhập, đăng ký với Firebase Auth
- **Quản lý sinh viên**: CRUD đầy đủ (Thêm, Sửa, Xóa, Xem chi tiết)
- **Quản lý giáo viên**: CRUD đầy đủ (Chỉ Admin)
- **Dashboard thống kê**: Tổng số sinh viên, giáo viên, GPA trung bình
- **Tìm kiếm & Lọc**: Theo tên, mã, email, trạng thái, ngành, lớp
- **Export CSV**: Xuất danh sách ra file CSV (hỗ trợ tiếng Việt)
- **Dark/Light Mode**: Chuyển đổi giao diện sáng/tối
- **Responsive Design**: Hoạt động tốt trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4, shadcn/ui
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: Lucide React

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18.x trở lên
- npm hoặc yarn hoặc pnpm

\`\`\`

### Bước 1: Cài đặt dependencies

\`\`\`bash
# Sử dụng npm
npm install

# Hoặc yarn
yarn install

# Hoặc pnpm
pnpm install
\`\`\`

### Bước 2: Cấu hình Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc sử dụng project có sẵn
![alt text](image-6.png)
3. Bật **Authentication** với Email/Password provider
4. Tạo **Firestore Database**
5. Lấy Firebase config từ Project Settings
Không biết Authentication và Firestore Database ở đâu thì click vào link hinhf ảnh dòng dưới
![alt text](image-1.png)
### Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` ở thư mục gốc:

\`\`\`env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

**Hoặc** chỉnh sửa trực tiếp trong file `lib/firebase-config.ts`:
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
\`\`\`typescript
export const firebaseConfig = {
  apiKey: "AIzaSyBq6jkPCdKauqkJWhtKLo-wH9qDdPQbR3w",
  authDomain: "student-app-53158.firebaseapp.com",
  projectId: "student-app-53158",
  storageBucket: "student-app-53158.firebasestorage.app",
  messagingSenderId: "747967696084",
  appId: "1:747967696084:web:3c7fa78d5c8bead95cbf41",
  measurementId: "G-X65QCRC4G2"
};
\`\`\`

### Bước4: Chạy ứng dụng

\`\`\`bash
# Development mode
npm run dev

# Hoặc
yarn dev

# Hoặc
pnpm dev
\`\`\`

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### Bước 5: Build cho Production

\`\`\`bash
# Build
npm run build

# Chạy production
npm run start
\`\`\`

## 🔐 Tài khoản mặc định

### Admin
- **Email**: `admin@gmail.com`
- **Password**: `123456`

> ⚠️ **Lưu ý**: Bạn cần đăng ký tài khoản admin này lần đầu tiên. Hệ thống sẽ tự động nhận diện email `admin@gmail.com` và cấp quyền Admin.

## 📁 Cấu trúc thư mục

\`\`\`
student-management-app/
├── app/
│   ├── globals.css          # Global styles với Tailwind
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Trang chính
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── auth-form.tsx        # Form đăng nhập/đăng ký
│   ├── dashboard.tsx        # Dashboard chính
│   ├── dashboard-stats.tsx  # Thống kê dashboard
│   ├── student-table.tsx    # Bảng sinh viên
│   ├── student-form.tsx     # Form thêm/sửa sinh viên
│   ├── student-detail.tsx   # Chi tiết sinh viên
│   ├── teacher-table.tsx    # Bảng giáo viên
│   ├── teacher-form.tsx     # Form thêm/sửa giáo viên
│   ├── teacher-detail.tsx   # Chi tiết giáo viên
│   └── user-management.tsx  # Quản lý phân quyền
├── lib/
│   ├── auth-context.tsx     # Context authentication
│   ├── auth-service.ts      # Firebase Auth REST API
│   ├── firebase-config.ts   # Cấu hình Firebase
│   ├── firestore-service.ts # Firestore REST API
│   ├── export-utils.ts      # Tiện ích export CSV
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── README.md
\`\`\`

## 🔥 Firebase Security Rules

Thêm rules sau vào Firestore để bảo mật dữ liệu:
vào rules của firestore như sau xem hình ảnh bên dưới
![alt text](image-2.png)
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Chỉ cho phép user đã đăng nhập
    match /students/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /teachers/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
\`\`\`



## 📝 Hướng dẫn sử dụng

### Đăng ký tài khoản Admin
1. Mở ứng dụng, chọn tab "Đăng ký"
2. Nhập email: `admin@gmail.com`, mật khẩu: `123456`
3. Đăng nhập với tài khoản vừa tạo

### Quản lý sinh viên
1. Đăng nhập với tài khoản Admin hoặc Giáo viên
2. Vào tab "Sinh viên"
3. Click "Thêm sinh viên" để thêm mới
4. Click vào dòng để xem chi tiết
5. Sử dụng các nút Sửa/Xóa để chỉnh sửa

### Quản lý giáo viên (Chỉ Admin)
1. Đăng nhập với tài khoản Admin
2. Vào tab "Giáo viên"
3. Thực hiện các thao tác CRUD tương tự

### Phân quyền người dùng (Chỉ Admin)
1. Đăng nhập với tài khoản Admin
2. Vào tab "Phân quyền"
3. Thay đổi vai trò của người dùng (Admin/Giáo viên/User)

### Export dữ liệu
1. Click nút "Xuất CSV" ở tab Sinh viên hoặc Giáo viên
2. File CSV sẽ tự động tải về

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Firebase: Error (auth/invalid-api-key)"
- Kiểm tra lại API key trong `firebase-config.ts`
- Đảm bảo đã bật Authentication trong Firebase Console

### Lỗi "Missing or insufficient permissions"
- Kiểm tra Firestore Security Rules
- Đảm bảo user đã đăng nhập

### Lỗi CORS
- Thêm domain vào Authorized domains trong Firebase Console

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Liên hệ

- **Author**: VanBinh2
- **GitHub**: [https://github.com/VanBinh2](https://github.com/VanBinh2)
- **Project Link**: [https://github.com/VanBinh2/student-management-app](https://github.com/VanBinh2/student-management-app)

---

⭐ Nếu thấy project hữu ích, hãy cho một star nhé!
