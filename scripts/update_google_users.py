import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
import sys

"""
SCRIPT: Cập nhật thông tin Google Account cho Firestore
Mô tả: 
    Script này lấy thông tin chi tiết của một user từ Firebase Authentication (như displayName, photoURL) 
    và cập nhật vào document tương ứng trong Firestore. Thường dùng khi một user đăng nhập bằng Google 
    nhưng document trong Firestore bị thiếu dữ liệu.

Cách dùng:
    python scripts/update_google_users.py <path_to_key.json> <UID> [collection_name]

Tham số:
    1. <path_to_key.json>: Đường dẫn tới file Service Account Key (JSON).
    2. <UID>: UID của người dùng cần cập nhật (lấy từ Firebase Auth Console).
    3. [collection_name]: (Tùy chọn) Tên collection trong Firestore, mặc định là 'users'.

Ví dụ:
    python scripts/update_google_users.py scripts/serviceAccountKey.json ABC123XYZ users
"""

def update_single_google_user(key_path, target_uid, collection_name='users'):
    if not os.path.exists(key_path):
        print(f"❌ Không tìm thấy file: {key_path}")
        return

    try:
        # Khởi tạo Firebase Admin SDK
        if not firebase_admin._apps:
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        
        print(f"🔍 Đang lấy thông tin từ Firebase Auth cho UID: {target_uid}...")
        try:
            auth_user = auth.get_user(target_uid)
        except auth.UserNotFoundError:
            print(f"❌ Không tìm thấy user với UID này trong Firebase Authentication.")
            return

        # Kiểm tra xem có phải tài khoản Google không
        provider_ids = [p.provider_id for p in auth_user.provider_data]
        is_google = 'google.com' in provider_ids
        
        email = auth_user.email
        display_name = auth_user.display_name
        photo_url = auth_user.photo_url
        
        print(f"👤 User: {email}")
        print(f"🏷️ Provider: {', '.join(provider_ids)}")
        
        # Tìm tài khoản trong Firestore theo Email (hoặc UID)
        # Ưu tiên tìm theo email vì thường các tài khoản được tạo trước qua email
        user_query = db.collection(collection_name).where('email', '==', email).limit(1).get()
        
        if not user_query:
            # Thử tìm theo UID nếu email không thấy
            user_query = db.collection(collection_name).where('uid', '==', target_uid).limit(1).get()

        if user_query:
            doc = user_query[0]
            doc_ref = db.collection(collection_name).document(doc.id)
            
            update_data = {
                'uid': target_uid,
                'displayName': display_name,
                'photoURL': photo_url,
                'provider': 'google.com' if is_google else provider_ids[0] if provider_ids else 'password'
            }
            
            # Chỉ cập nhật các trường có dữ liệu (tránh ghi đè None)
            update_data = {k: v for k, v in update_data.items() if v is not None}
            
            doc_ref.update(update_data)
            print(f"✅ Đã cập nhật thông tin thành công vào Firestore (Doc ID: {doc.id})")
        else:
            print(f"⚠️ Không tìm thấy document nào khớp với email/uid này trong collection '{collection_name}'.")
            print("💡 Gợi ý: Hãy đảm bảo user đã tồn tại trong Firestore trước khi chạy script này.")
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Lỗi hệ thống: {error_msg}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("❌ Thiếu tham số!")
        print("Cách dùng: python scripts/update_google_users.py <path_to_key.json> <UID> [collection_name]")
        sys.exit(1)
        
    key_path = sys.argv[1]
    uid = sys.argv[2]
    target_collection = sys.argv[3] if len(sys.argv) > 3 else 'users'
    
    update_single_google_user(key_path, uid, target_collection)
