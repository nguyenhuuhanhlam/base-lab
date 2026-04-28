# UI Standards & Quyết định kỹ thuật

---

## 1. UI Design Guidelines

### Typography & Spacing
- Font chữ tối đa `text-sm` (14px) cho nội dung thường, nhãn, menu, nút
- Dùng heading lớn hơn chỉ khi thực sự cần thiết
- Loại bỏ khoảng space thừa — padding/margin vừa phải, thu gọn header/sidebar
- Thiết kế phải gọn gàng, tiết kiệm không gian hiển thị

### Loading & Spinner
- Dùng `Loader2` từ `lucide-react` với class `animate-spin`
- Màn hình loading căn giữa tuyệt đối: `flex h-screen items-center justify-center`
- Màu chuẩn: `stone-50` cho background, `stone-700` cho icon

### Color System
- Dùng hệ màu **stone** cho loading/neutral states
- Badge roles: `admin` → blue-50/700 | `manager` → green-50/700

---

## 2. Auth Module — Patterns & Anti-patterns

### Login Page
- Dùng shadcn `Card` (`CardHeader`, `CardContent`, `CardFooter`) — không dùng div thủ công
- Error message: background đỏ nhạt + border rõ ràng
- Google sign-in: `signInWithPopup` + `GoogleAuthProvider` → tách `GoogleIcon` vào `src/components/icons/google_icon.tsx`
- Email/password: `signInWithEmailAndPassword` kết nối Firebase thật
- `isDisabled` gộp tất cả loading states → apply nhất quán

### Auth Store (`auth_store.ts`)
```ts
// State cần có
{
  isLoggedIn: boolean;
  isInitializing: boolean;  // tránh nháy UI khi F5
  user: User | null;        // Firebase User object
  profile: ProfileData | null; // từ Firestore
}

// login() nhận User object từ Firebase
login(user: User): void
```

### ❌ Đừng dùng React Query cho Firebase Auth login
`useMutation` không phù hợp cho login vì:
- React Query quản lý **server state** (cache, refetch) — login không có server state
- Firebase Auth tự quản lý session

✅ Dùng `useState` + `async/await` cho login form.

✅ Dùng React Query khi: fetch user profile từ Firestore, update profile, check token.

---

## 3. Coding Practices

### React 19 Compatibility
- **Tránh `React.FormEvent`** (deprecated) → dùng `React.SyntheticEvent` cho `handleSubmit`
- Luôn dọn biến không dùng để giữ code sạch

### Component Structure
- Tách icon thành file riêng trong `src/components/icons/`
- Centralize constants vào `src/lib/constants.ts`

---

## 4. Vite Config & Aliases

```ts
// vite.config.ts
import path from "path";
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

Import alias: dùng `@/` thay vì đường dẫn tương đối dài.

---

## 5. Dependencies nhanh

```bash
npm install react-router-dom          # routing
npm install @tanstack/react-table     # table management
npx shadcn@latest add table           # shadcn table primitives
```

| Package | Version |
|---|---|
| react-router-dom | ^6.x |
| @tanstack/react-table | ^8.x |
| vite | ^5.x |
| Firebase | v12+ (modular) |

---

## 6. Firebase Setup Checklist

- [ ] Bật **Google sign-in provider** trong Firebase Console → Authentication → Sign-in methods
- [ ] Cấu hình Firestore rules
- [ ] Kiểm tra `AUTH_COLLECTION` và `AUTH_DISPLAY_FIELD` trong `src/lib/constants.ts`
- [ ] Không dùng `orderBy` server-side nếu documents có thể thiếu field → sort client-side
