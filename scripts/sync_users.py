import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import sys

def sync_firestore_to_auth(key_path, collection_name='users'):
    if not os.path.exists(key_path):
        print(f"❌ Không tìm thấy file: {key_path}")
        return

    try:
        # Khởi tạo Firebase Admin SDK
        if not firebase_admin._apps:
            print(f"🔑 Đang khởi tạo Firebase với key: {key_path}")
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print(f"📡 Đang kiểm tra kết nối tới Firebase...")
        
        # Test connection by trying to get a single document
        try:
            # Lấy thử 1 tài liệu để kiểm tra kết nối
            test_docs = db.collection(collection_name).limit(1).get()
            print("✅ Kết nối thành công!")
        except Exception as conn_err:
            print(f"❌ Kết nối thất bại: {conn_err}")
            return

        print(f"🔍 Đang đọc dữ liệu từ collection: '{collection_name}'...")
        
        users_ref = db.collection(collection_name)
        docs = users_ref.stream()
        
        success_count = 0
        skip_count = 0
        error_count = 0
        processed_count = 0
        
        for doc in docs:
            processed_count += 1
            user_data = doc.to_dict()
            email = user_data.get('email')
            display_name = user_data.get('displayName') or user_data.get('name')
            
            print(f"🔄 [{processed_count}] Đang xử lý: {email or doc.id}...", end='\r')
            
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
        error_msg = str(e)
        print(f"❌ Lỗi hệ thống: {error_msg}")
        
        if "invalid_grant" in error_msg or "Invalid JWT Signature" in error_msg:
            print("\n💡 GỢI Ý KHẮC PHỤC:")
            print("1. Kiểm tra lại file JSON: Có thể file bị lỗi, bị sửa đổi hoặc không phải là 'Service Account Key'.")
            print("2. Kiểm tra thời gian hệ thống: Nếu đồng hồ máy tính bị sai lệch, chữ ký JWT sẽ bị từ chối.")
            print("3. Kiểm tra mạng/Proxy: Nếu bạn đang dùng VPN hoặc Proxy, hãy thử tắt đi.")
            print("4. Thử tạo một Key mới từ Firebase Console (Project Settings > Service Accounts).")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Thiếu tham số!")
        print("Cách dùng: python sync_users.py <path_to_key.json> [collection_name]")
        sys.exit(1)
        
    key_path = sys.argv[1]
    target_collection = sys.argv[2] if len(sys.argv) > 2 else 'users'
    
    sync_firestore_to_auth(key_path, target_collection)
