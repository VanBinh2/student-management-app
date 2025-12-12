# Student Management App

![App Screenshot](https://placehold.co/1200x600)

## 📖 Giới thiệu

**Student Management App** là ứng dụng quản lý sinh viên toàn diện, được thiết kế để giúp các trường học và trung tâm giáo dục quản lý thông tin hiệu quả.

Ứng dụng bao gồm các chức năng cốt lõi như thêm/sửa/xóa sinh viên, quản lý lớp học, giáo viên, tìm kiếm thông minh, phân trang và dashboard thống kê trực quan. Hệ thống được xây dựng dựa trên nền tảng **Next.js (React)** cho giao diện và **Firebase** cho phần xác thực (Authentication) cũng như cơ sở dữ liệu thời gian thực (Firestore Database).

---

## 📑 Mục lục

1. [Giới thiệu](#-giới-thiệu)
2. [Tính năng chính](#-tính-năng-chính)
3. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
4. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
5. [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
6. [Cách tạo dự án Firebase](#-cách-tạo-dự-án-firebase-bắt-buộc-có)
    - [Bật Authentication](#bật-authentication-emailpassword)
    - [Tạo Firestore Database](#tạo-firestore-database)
    - [Lấy firebaseConfig](#lấy-firebaseconfig)
7. [Cấu hình .env.local](#-cấu-hình-envlocal)
8. [Chạy dự án](#-chạy-dự-án)
9. [Tài khoản Admin mẫu](#-tài-khoản-admin-mẫu)
10. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
11. [Troubleshooting](#-troubleshooting)
12. [Deploy](#-deploy)
13. [License](#-license)

---

## 🚀 Tính năng chính

*   **Firebase Authentication**: Đăng nhập/Đăng xuất an toàn bằng Email/Password.
*   **Dashboard thống kê**: Biểu đồ tổng quan về số lượng sinh viên, lớp học, và hoạt động gần đây.
*   **CRUD Sinh viên**: Thêm mới, cập nhật thông tin, và xóa sinh viên.
*   **CRUD Lớp học & Giáo viên**: Quản lý danh sách lớp và giáo viên phụ trách.
*   **Quản lý tài khoản**: Phân quyền Admin và User (nếu có).
*   **Tìm kiếm Real-time**: Tìm kiếm sinh viên theo tên hoặc mã số ngay lập tức.
*   **Phân trang (Pagination)**: Xử lý danh sách dữ liệu lớn mượt mà.
*   **Xuất Excel**: Export danh sách sinh viên ra file Excel chỉ với 1 click.
*   **UI/UX Hiện đại**: Giao diện đẹp mắt, thân thiện sử dụng **Next.js**, **Tailwind CSS** và **shadcn/ui**.

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Vai trò |
| :--- | :--- |
| **Next.js** | Frontend Framework (App Router) |
| **React** | UI Library |
| **TypeScript** | Ngôn ngữ lập trình chính (Type safety) |
| **Firebase Auth** | Xác thực người dùng (Login/Logout) |
| **Firebase Firestore** | NoSQL Database (Lưu trữ dữ liệu) |
| **Tailwind CSS** | Utility-first CSS Framework |
| **shadcn/ui** | Bộ UI Components hiện đại, tái sử dụng |
| **Lucide Icons** | Icon set nhẹ và đẹp |
| **XLSX** | Thư viện xử lý xuất file Excel |

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy của bạn đã cài đặt:

*   **Node.js**: Phiên bản 18.0.0 trở lên.
*   **Package Manager**: `npm` hoặc `yarn`.
*   **Tài khoản Google**: Để tạo dự án trên Firebase.

---

## 📦 Hướng dẫn cài đặt

**Bước 1:** Clone dự án hoặc tải về máy, sau đó mở thư mục dự án trong **VS Code**.

**Bước 2:** Cài đặt các thư viện (dependencies) cần thiết. Mở Terminal tại thư mục gốc và chạy:

```bash
npm install
# hoặc
yarn install
```

**Bước 3:** Tiến hành cấu hình Firebase theo hướng dẫn bên dưới.

---

## 🔥 Cách tạo dự án Firebase (Bắt buộc có)

Để App hoạt động, bạn cần kết nối với Firebase của riêng mình.

### Bước 1 – Truy cập Firebase Console
Truy cập: [https://console.firebase.google.com](https://console.firebase.google.com)

### Bước 2 – Tạo Project
1. Nhấn vào **Create Project** (hoặc Add project).
2. Nhập tên project: `student-management-app`.
3. Nhấn **Continue**.
4. Ở bước Google Analytics: Có thể tắt (không bắt buộc).
5. Nhấn **Create Project**.

### Bật Authentication (Email/Password)
1. Trong menu bên trái, chọn **Build** → **Authentication**.
2. Nhấn **Get Started**.
3. Chọn tab **Sign-in method**.
4. Chọn **Email/Password**.
5. Bật switch **Enable**.
6. Nhấn **Save**.

### Tạo Firestore Database
1. Trong menu bên trái, chọn **Build** → **Firestore Database**.
2. Nhấn **Create Database**.
3. Chọn chế độ bảo mật: Chọn **Start in test mode** (Để dễ dàng phát triển, lưu ý bảo mật lại khi production).
4. Nhấn **Next**.
5. Chọn location (region): Khuyến nghị chọn **asia-southeast1** (Singapore) cho tốc độ tốt nhất tại VN.
6. Nhấn **Enable**.

Sau khi tạo xong, bạn nên tạo trước các **Collections** sau (hoặc để App tự tạo khi chạy):
*   `students`
*   `classes`
*   `teachers`
*   `users`

### Lấy firebaseConfig
1. Nhấn vào biểu tượng bánh răng ⚙️ (Project Settings) ở menu bên trái.
2. Chọn tab **General**.
3. Cuộn xuống mục **Your Apps**, nhấn vào biểu tượng **</> (Web)**.
4. Nhập tên App nickname: `student-management-web`.
5. Nhấn **Register app**.
6. Firebase sẽ hiện ra đoạn mã cấu hình. Hãy copy đoạn `firebaseConfig` tương tự như sau:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "student-app.firebaseapp.com",
  projectId: "student-app",
  storageBucket: "student-app.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
```

---

## 🔑 Cấu hình .env.local

Tạo một file tên là `.env.local` tại thư mục gốc của dự án. Copy nội dung dưới đây và điền các giá trị từ `firebaseConfig` bạn vừa lấy được:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=dán_apiKey_vào_đây
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dán_authDomain_vào_đây
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dán_projectId_vào_đây
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dán_storageBucket_vào_đây
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=dán_messagingSenderId_vào_đây
NEXT_PUBLIC_FIREBASE_APP_ID=dán_appId_vào_đây
```

> ⚠️ **Lưu ý:** Không có khoảng trắng xung quanh dấu `=`. Không cần dấu ngoặc kép `""` bao quanh giá trị.

---

## ▶️ Chạy dự án

Sau khi cấu hình xong, bạn có thể chạy dự án:

### Môi trường Development
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Build Production
```bash
npm run build
npm start
```

---

## 👤 Tài khoản Admin mẫu

Do ứng dụng có chức năng đăng nhập, bạn có thể tạo tài khoản trực tiếp trên giao diện hoặc sử dụng thông tin Demo này (nếu bạn đã import dữ liệu mẫu):

*   **Email:** `admin@example.com`
*   **Password:** `123456`

---

## 📂 Cấu trúc thư mục

```
student-management-app/
├── app/                  # Next.js App Router
│   ├── dashboard/        # Trang Dashboard
│   ├── students/         # Các trang quản lý sinh viên (list, add, edit)
│   ├── classes/          # Quản lý lớp học
│   ├── login/            # Trang đăng nhập
│   └── layout.tsx        # Layout chính (Sidebar, Header)
├── components/           # React Components tái sử dụng
│   ├── ui/               # shadcn/ui components (Button, Input...)
│   └── ...
├── firebase/             # Cấu hình Firebase
│   └── config.ts         # Khởi tạo Auth và Firestore
├── lib/                  # Các hàm tiện ích (utils)
│   └── utils.ts
├── styles/               # Global CSS
├── .env.local            # Biến môi trường (Không commit file này)
├── package.json
└── README.md
```

---

## ❓ Troubleshooting (Sửa lỗi thường gặp)

**1. Màn hình trắng hoặc lỗi "Firebase: No Firebase App '[DEFAULT]' has been created"**
*   Kiểm tra kỹ file `.env.local`. Đảm bảo tên biến đúng là `NEXT_PUBLIC_...` và bạn đã khởi động lại server (`npm run dev`) sau khi sửa file env.

**2. Firestore: "Missing or insufficient permissions"**
*   Vào Firebase Console → Firestore Database → Tab **Rules**.
*   Đảm bảo rules cho phép đọc/ghi. Ví dụ (cho test mode):
    ```
    allow read, write: if true;
    ```
    *(Lưu ý: Khi deploy thật cần set rule chặt chẽ hơn)*.

**3. Auth: "Firebase: Error (auth/invalid-credential)"**
*   Kiểm tra xem Email/Password nhập đúng chưa.
*   Đảm bảo bạn đã bật **Email/Password Provider** trong Authentication console.

**4. Lỗi Build Next.js**
*   Thường do TypeScript errors. Chạy `npm run lint` để kiểm tra lỗi cú pháp trước khi build.

**5. Không xuất được Excel**
*   Kiểm tra trình duyệt có chặn popup không, hoặc kiểm tra console xem dữ liệu đầu vào cho thư viện `xlsx` có bị rỗng không.

---

## 🌐 Deploy


### 1. Firebase Hosting
1. Cài Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Init: `firebase init` (Chọn Hosting, chọn existing project).
4. Build & Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

## 📜 License

Dự án được phân phối dưới giấy phép **MIT License**. Bạn có thể thoải mái sử dụng và chỉnh sửa.