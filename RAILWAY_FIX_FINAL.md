# 🔧 Fix Railway "cannot copy to non-directory" Error - FINAL SOLUTION

## ❌ Vấn đề

Railway đang cố copy `node_modules` từ cache cũ, gây lỗi:
```
ERROR: cannot copy to non-directory: /app/packages/api/node_modules/@prisma/client
```

## ✅ Giải pháp: Xóa và tạo lại service

Cache của Railway không bị ảnh hưởng bởi `.dockerignore`, nên cần xóa service hoàn toàn.

### Bước 1: Backup Environment Variables

1. Vào Railway Dashboard → Backend service
2. Settings → Variables
3. **Copy tất cả** Environment Variables ra file text (hoặc screenshot)
4. **QUAN TRỌNG**: Không được mất các biến này!

### Bước 2: Xóa Service

1. Vào Backend service
2. Settings → Danger Zone → **Delete Service**
3. Xác nhận xóa

### Bước 3: Tạo lại Service

1. Trong cùng Project, click "New" → "GitHub Repo"
2. Chọn repository của bạn
3. **Settings**:
   - **Name**: `elearning-api` (hoặc tên cũ)
   - **Root Directory**: Để **TRỐNG** (root của repo) ⭐
   - **Build Command**: 
     ```bash
     pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate && pnpm prisma db push
     ```
   - **Start Command**: 
     ```bash
     cd packages/api && pnpm dev
     ```

### Bước 4: Thêm lại Environment Variables

1. Vào Settings → Variables
2. Thêm lại tất cả Environment Variables đã backup
3. **Đặc biệt quan trọng**:
   - `DATABASE_URL` (copy từ PostgreSQL service)
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - Tất cả các biến khác

### Bước 5: Deploy

Railway sẽ tự động deploy. Lần này sẽ build từ đầu không có cache cũ.

## 🎯 Tại sao cách này hoạt động?

- Xóa service = xóa toàn bộ cache
- Tạo lại = build từ đầu, không có conflict với cache cũ
- Root Directory = trống → Railway sẽ detect `pnpm-lock.yaml` ở root
- Build Command đơn giản hơn (không cần `npm install -g pnpm` vì Railway đã có)

## ⚠️ Lưu ý

- **KHÔNG** quên backup Environment Variables!
- **KHÔNG** xóa PostgreSQL database (chỉ xóa backend service)
- Sau khi tạo lại, cần cập nhật `GOOGLE_CALLBACK_URL` và `FRONTEND_URL` với URL mới

## 📝 Checklist

- [ ] Backup tất cả Environment Variables
- [ ] Xóa backend service cũ
- [ ] Tạo lại service với Root Directory = trống
- [ ] Thêm lại tất cả Environment Variables
- [ ] Deploy thành công
- [ ] Test API health endpoint
- [ ] Cập nhật `GOOGLE_CALLBACK_URL` và `FRONTEND_URL` nếu URL thay đổi

