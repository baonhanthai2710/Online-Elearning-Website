# 🔐 Hướng dẫn Setup Google OAuth

## 📋 Tổng quan

`GOOGLE_CALLBACK_URL` là URL mà Google sẽ redirect về sau khi user đăng nhập bằng Google OAuth. URL này cần được cấu hình ở **2 nơi**:
1. **Backend Environment Variables** (Railway)
2. **Google Cloud Console** (OAuth 2.0 Client settings)

---

## 🚀 Các bước setup

### Bước 1: Lấy Backend URL từ Railway

1. **Deploy backend service** trên Railway (nếu chưa deploy)
   - Root Directory: `packages/api`
   - Build Command: `pnpm install && pnpm prisma generate && pnpm prisma db push`
   - Start Command: `pnpm dev`

2. **Lấy Backend URL**
   - Vào Railway Dashboard
   - Chọn backend service của bạn
   - Vào tab **Settings** → **Domains**
   - Railway tự động tạo domain, ví dụ:
     - `https://elearning-api-production.up.railway.app`
     - `https://elearning-api.railway.app`
   - **Copy URL này** (không có `/api/auth/google/callback`)

3. **Tạo Callback URL**
   - Thêm `/api/auth/google/callback` vào cuối URL
   - Ví dụ: `https://elearning-api-production.up.railway.app/api/auth/google/callback`
   - Đây chính là `GOOGLE_CALLBACK_URL`!

---

### Bước 2: Cấu hình trong Google Cloud Console

1. **Truy cập Google Cloud Console**
   - Vào: https://console.cloud.google.com
   - Chọn project của bạn (hoặc tạo mới)

2. **Tạo OAuth 2.0 Client ID** (nếu chưa có)
   - Vào **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Chọn **Web application**
   - Điền thông tin:
     - **Name**: `E-Learning Platform` (hoặc tên bạn muốn)
     - **Authorized JavaScript origins**: 
       - `https://your-backend.railway.app` (backend URL)
       - `https://your-frontend.railway.app` (frontend URL, nếu deploy trên Railway)
     - **Authorized redirect URIs**: 
       - `https://your-backend.railway.app/api/auth/google/callback` ⭐ (GOOGLE_CALLBACK_URL)

3. **Lấy Client ID và Client Secret**
   - Sau khi tạo, Google sẽ hiển thị:
     - **Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
     - **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`
   - **Copy 2 giá trị này**

---

### Bước 3: Cấu hình trong Railway

1. **Vào backend service** trên Railway
2. **Settings** → **Variables**
3. **Thêm các biến sau**:

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
```

> ⚠️ **Lưu ý**: 
> - Thay `your-backend.railway.app` bằng URL thực tế từ Railway
> - URL phải khớp **chính xác** với URL trong Google Cloud Console

4. **Redeploy backend** để áp dụng thay đổi

---

## ✅ Kiểm tra

1. **Test Google Login**
   - Truy cập frontend
   - Click "Đăng nhập bằng Google"
   - Nếu redirect về frontend với token → ✅ Thành công!
   - Nếu báo lỗi → Kiểm tra lại URL trong Google Cloud Console

2. **Xem logs**
   - Railway → Backend service → **Deployments** → **View Logs**
   - Tìm lỗi liên quan đến OAuth

---

## 🔧 Troubleshooting

### Lỗi: "redirect_uri_mismatch"

**Nguyên nhân**: URL trong Google Cloud Console không khớp với `GOOGLE_CALLBACK_URL`

**Giải pháp**:
1. Kiểm tra `GOOGLE_CALLBACK_URL` trong Railway
2. Kiểm tra **Authorized redirect URIs** trong Google Cloud Console
3. Đảm bảo 2 URL **hoàn toàn giống nhau** (kể cả `https://` và không có trailing slash)

### Lỗi: "invalid_client"

**Nguyên nhân**: `GOOGLE_CLIENT_ID` hoặc `GOOGLE_CLIENT_SECRET` sai

**Giải pháp**:
1. Kiểm tra lại Client ID và Secret trong Google Cloud Console
2. Copy lại vào Railway Environment Variables
3. Redeploy backend

### Lỗi: "access_denied"

**Nguyên nhân**: User từ chối cấp quyền

**Giải pháp**: Bình thường, không phải lỗi. User có thể thử lại.

---

## 📝 Checklist

- [ ] Backend đã được deploy trên Railway
- [ ] Đã lấy được backend URL từ Railway
- [ ] Đã tạo OAuth 2.0 Client ID trong Google Cloud Console
- [ ] Đã thêm callback URL vào **Authorized redirect URIs** trong Google Cloud Console
- [ ] Đã thêm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` vào Railway
- [ ] Đã redeploy backend
- [ ] Đã test Google login thành công

---

## 💡 Tips

- **Development**: Dùng `http://localhost:3001/api/auth/google/callback`
- **Production**: Dùng Railway backend URL + `/api/auth/google/callback`
- **Multiple environments**: Tạo OAuth Client ID riêng cho dev và production
- **Security**: Không commit Client Secret vào Git!

---

## 📚 Tài liệu tham khảo

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)

