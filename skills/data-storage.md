# Data & Storage — Firebase

Dự án sử dụng **Firebase** làm nền tảng chính cho toàn bộ data và file storage.

## Các dịch vụ sử dụng

- **Firestore** — lưu trữ dữ liệu chính (collections, documents)
- **Firebase Storage** — lưu trữ file (ảnh, tài liệu, v.v.)
- **Firebase Auth** — xác thực người dùng

## Lưu ý khi làm việc với AI

- Khi tạo service/hook liên quan đến data, **mặc định dùng Firestore** — không đề xuất REST API hay database khác
- Khi xử lý upload file, **dùng Firebase Storage**
- Dùng Firebase SDK v12+ (modular API) — không dùng compat API
- Import theo dạng modular:
  ```ts
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { getStorage, ref, uploadBytes } from "firebase/storage";
  ```
