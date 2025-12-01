# 🔧 Fix Railway CLI "The system cannot find the path specified"

## ❌ Vấn đề

Khi chạy `railway run cd packages/api && pnpm prisma db push`, gặp lỗi:
```
The system cannot find the path specified.
```

## 🔍 Nguyên nhân

1. **Railway CLI chạy command trên Railway server**, nhưng có thể không load environment variables đúng cách
2. **DATABASE_URL** có thể chưa được set trong Railway, hoặc Railway CLI không load được
3. **Internal database URL** (`postgres.railway.internal:5432`) chỉ hoạt động trong Railway network, không thể truy cập từ local

## ✅ Giải pháp

### Cách 1: Kiểm tra Root Directory và dùng command phù hợp

1. **Vào Railway Dashboard** → Backend service → **Settings** → **Build**
2. **Xem Root Directory**:
   - Nếu = `packages/api` → Dùng command 1
   - Nếu = trống (root) → Dùng command 2

**⚠️ QUAN TRỌNG: Phải chạy từ thư mục project!**

1. **CD vào thư mục project trước:**
   ```powershell
   cd "C:\HAIDUONG\4THYEARSEMESTER1\TLCN\New folder\Online-Elearning-Website"
   ```

2. **Sau đó chạy command:**

   **Command 1: Root Directory = `packages/api`**
   ```bash
   railway run pnpm prisma db push
   ```

   **Command 2: Root Directory = trống (root)**
   ```bash
   railway run pnpm --filter api prisma db push
   ```

   **Command 3: Dùng bash wrapper**
   ```bash
   railway run bash -c "cd packages/api && pnpm prisma db push"
   ```

### Cách 2: Thêm vào Start Command (Khuyến nghị - Dễ nhất) ✅

**Tại sao cách này tốt nhất:**
- ✅ Chạy trực tiếp trên Railway server với environment variables đầy đủ
- ✅ Không cần Railway CLI
- ✅ DATABASE_URL được load tự động từ Railway
- ✅ Đơn giản và đáng tin cậy

Nếu Railway CLI không hoạt động, dùng cách này:

1. **Vào Railway Dashboard** → Backend service → **Settings** → **Build**
2. **Cập nhật Start Command**:

   **Nếu Root Directory = trống (root):**
   ```bash
   cd packages/api && pnpm prisma db push && pnpm dev
   ```

   **Nếu Root Directory = `packages/api`:**
   ```bash
   pnpm prisma db push && pnpm dev
   ```

3. **Save và Redeploy**
4. **Xem logs** trong Deployments → tìm dòng:
   ```
   ✔ Your database is now in sync with your Prisma schema.
   ```
   hoặc
   ```
   Database schema is up to date.
   ```

5. **Sau khi thấy log thành công**, đổi lại Start Command về:
   ```bash
   cd packages/api && pnpm dev
   ```
   hoặc
   ```bash
   pnpm dev
   ```

6. **Redeploy** lại

### Cách 3: Tạo script riêng

1. Tạo file `packages/api/setup-db.sh`:
   ```bash
   #!/bin/bash
   pnpm prisma db push
   pnpm dev
   ```

2. Cập nhật Start Command: `bash setup-db.sh`

3. Sau khi chạy xong, đổi lại về `pnpm dev`

## 🎯 Khuyến nghị

**Dùng Cách 2** (thêm vào Start Command) vì:
- ✅ Không cần Railway CLI
- ✅ Chạy tự động khi deploy
- ✅ Dễ kiểm tra trong logs
- ✅ Chỉ cần chạy 1 lần, sau đó đổi lại

## 📝 Lưu ý

- `prisma db push` chỉ cần chạy **1 lần** sau khi deploy lần đầu
- Sau khi database đã sync, không cần chạy lại
- Nếu schema thay đổi, cần chạy lại `prisma db push`

