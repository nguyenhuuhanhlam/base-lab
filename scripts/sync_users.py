import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import sys

def sync_firestore_to_auth(collection_name):
    # Đường dẫn tới file key (mặc định nằm cùng thư mục scripts)
    key_path = os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
    
    if not os.path.exists(key_path):
        print(f"❌ Không tìm thấy file: {key_path}")
        print("Vui lòng tải serviceAccountKey.json từ Firebase Console và đặt vào thư mục scripts!")
        return

    try:
        # Khởi tạo Firebase Admin SDK (tránh khởi tạo nhiều lần)
        if not firebase_admin._apps:
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print(f"🔍 Đang đọc dữ liệu từ collection: '{collection_name}'...")
        
        users_ref = db.collection(collection_name)
        docs = users_ref.stream()
        
        success_count = 0
        skip_count = 0
        error_count = 0
        
        for doc in docs:
            user_data = doc.to_dict()
            email = user_data.get('email')
            display_name = user_data.get('displayName') or user_data.get('name')
            
            if not email:
                print(f"⚠️ Bỏ qua doc {doc.id}: Không có trường 'email'")
                continue
            
            # Logic tạo mật khẩu: lấy phần trước dấu @
            password = email.split('@')[0]
            
            # Kiểm tra mật khẩu độ dài tối thiểu (Firebase yêu cầu min 6 ký tự)
            if len(password) < 6:
                # Nếu ngắn quá thì thêm hậu tố cố định hoặc padding
                password = password.ljust(6, '0')

            try:
                # Thử tạo user mới
                user = auth.create_user(
                    email=email,
                    password=password,
                    display_name=display_name
                )
                print(f"✅ Đã tạo user: {email}")
                success_count += 1
                
            except auth.EmailAlreadyExistsError:
                # Bỏ qua nếu email đã tồn tại (bao gồm cả các account Google đã link)
                print(f"ℹ️ Bỏ qua: {email} đã tồn tại trong Authentication.")
                skip_count += 1
            except Exception as e:
                print(f"❌ Lỗi khi tạo user {email}: {e}")
                error_count += 1
        
        print("\n" + "="*30)
        print(f"📊 KẾT QUẢ ĐỒNG BỘ:")
        print(f"- Thành công: {success_count}")
        print(f"- Bỏ qua (đã có): {skip_count}")
        print(f"- Lỗi: {error_count}")
        print("="*30)
        
    except Exception as e:
        print(f"❌ Lỗi hệ thống: {e}")

if __name__ == "__main__":
    # Tên collection mặc định là 'users'
    target_collection = 'users'
    
    # Cho phép ghi đè tên collection qua tham số dòng lệnh
    if len(sys.argv) > 1:
        target_collection = sys.argv[1]
    
    sync_firestore_to_auth(target_collection)
