# 🔍 Cách tìm Backend URL trên Railway

## 📍 Vị trí URL trên Railway

Railway hiển thị URL ở nhiều nơi khác nhau tùy theo giao diện:

### Cách 1: Dashboard chính (Dễ nhất) ✅

1. Vào Railway Dashboard
2. Chọn **backend service** của bạn
3. Xem ở **phần trên cùng** của service card
4. Sẽ thấy URL dạng: `https://your-service-name.up.railway.app`
5. Click vào URL để mở trong browser mới

### Cách 2: Settings → Networking

1. Vào backend service
2. Click **Settings** (biểu tượng bánh răng ⚙️)
3. Tìm tab **Networking** hoặc **General**
4. Tìm phần **Public Domain** hoặc **Custom Domain**
5. Copy URL hiển thị ở đó

### Cách 3: Service Overview

1. Vào backend service
2. Xem tab **Overview** hoặc **Deployments**
3. URL có thể hiển thị ở phần thông tin service

### Cách 4: Test endpoint (Nếu không thấy)

1. Sau khi deploy thành công
2. Thử truy cập: `https://your-service-name.up.railway.app/api/health`
   - Thay `your-service-name` bằng tên service của bạn
3. Nếu trả về `{"status":"ok"}` → đó chính là backend URL đúng

### Cách 5: Xem trong Logs

1. Vào **Deployments** → Click deployment mới nhất
2. Xem **Logs** hoặc **Build Logs**
3. Railway có thể in URL trong logs

## 🎯 Ví dụ URL

Railway URL thường có format:
- `https://your-service-name.up.railway.app`
- `https://elearning-api-production.up.railway.app`
- `https://elearning-api.railway.app`

## ⚠️ Lưu ý

- URL chỉ xuất hiện **sau khi deploy thành công**
- Nếu chưa thấy URL, đợi vài phút hoặc refresh trang
- Mỗi service có URL riêng
- URL có thể thay đổi nếu bạn đổi tên service

## 🔗 Sau khi có URL

1. **Backend URL**: Dùng cho `VITE_API_URL` trong frontend
2. **GOOGLE_CALLBACK_URL**: Backend URL + `/api/auth/google/callback`
3. **FRONTEND_URL**: Dùng cho CORS trong backend
4. **Stripe Webhook**: Backend URL + `/api/stripe-webhook`

