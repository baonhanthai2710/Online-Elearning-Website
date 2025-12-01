# 🔧 Fix Google OAuth "Invalid Redirect: must contain a domain" Error

## ❌ Lỗi thường gặp

Khi thêm redirect URI vào Google Cloud Console, bạn có thể gặp lỗi:
```
Invalid Redirect: must contain a domain.
```

## 🔍 Nguyên nhân

### 1. Thiếu dấu `/` sau `https:`

**❌ SAI:**
```
https:/online-elearning-website-production.up.railway.app/api/auth/google/callback
```

**✅ ĐÚNG:**
```
https://online-elearning-website-production.up.railway.app/api/auth/google/callback
```

### 2. URL bị cắt ngắn

**❌ SAI:**
```
https://online-elearning-website-production.up.railway.app/api/auth/gc
```

**✅ ĐÚNG:**
```
https://online-elearning-website-production.up.railway.app/api/auth/google/callback
```

### 3. Có khoảng trắng hoặc ký tự đặc biệt

**❌ SAI:**
```
https://online-elearning-website-production.up.railway.app/api/auth/google/callback 
```
(Có khoảng trắng ở cuối)

**✅ ĐÚNG:**
```
https://online-elearning-website-production.up.railway.app/api/auth/google/callback
```

## ✅ Cách sửa

1. **Copy URL từ Railway**
   - Đảm bảo copy đầy đủ, không thiếu ký tự
   - URL phải bắt đầu bằng `https://` (2 dấu `/`)

2. **Thêm đường dẫn callback**
   - Thêm `/api/auth/google/callback` vào cuối
   - Đảm bảo không có khoảng trắng

3. **Kiểm tra lại**
   - URL phải có format: `https://domain.com/path`
   - Không có khoảng trắng
   - Không thiếu ký tự

## 📝 Ví dụ URL đúng

```
https://online-elearning-website-production.up.railway.app/api/auth/google/callback
```

## 🎯 Checklist

- [ ] URL bắt đầu bằng `https://` (2 dấu `/`)
- [ ] Domain đầy đủ: `online-elearning-website-production.up.railway.app`
- [ ] Đường dẫn đầy đủ: `/api/auth/google/callback`
- [ ] Không có khoảng trắng
- [ ] Không có ký tự đặc biệt không hợp lệ

## 💡 Tips

- Copy URL từ Railway và paste vào text editor trước
- Kiểm tra kỹ trước khi paste vào Google Cloud Console
- Nếu vẫn lỗi, thử xóa và nhập lại từ đầu

