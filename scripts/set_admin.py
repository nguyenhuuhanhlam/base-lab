import firebase_admin
from firebase_admin import credentials, auth
import sys
import os

def set_admin_claims(uid):
    # Đường dẫn tới file key (mặc định nằm cùng thư mục scripts)
    key_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
    
    if not os.path.exists(key_path):
        print(f"❌ Không tìm thấy file: {key_path}")
        print("Vui lòng tải serviceAccountKey.json từ Firebase Console và đặt vào thư mục scripts.")
        return

    try:
        # Khởi tạo Firebase Admin SDK
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        
        # Thiết lập Custom Claims
        auth.set_custom_user_claims(uid, {
            'role': 'admin',
            'approved': True
        })
        
        print(f"✅ Đã cấp quyền Admin thành công cho user: {uid}")
        print("👉 Lưu ý: User cần Đăng xuất và Đăng nhập lại để cập nhật quyền mới.")
        
    except Exception as e:
        print(f"❌ Lỗi hệ thống: {e}")

if __name__ == "__main__":
    # Kiểm tra tham số dòng lệnh
    if len(sys.argv) < 2:
        print("Sử dụng: python scripts/set_admin.py <UID>")
        sys.exit(1)
        
    target_uid = sys.argv[1]
    set_admin_claims(target_uid)
