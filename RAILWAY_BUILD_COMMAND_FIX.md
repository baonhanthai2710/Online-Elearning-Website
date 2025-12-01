# 🔧 Fix Railway Build Command - Remove prisma db push

## ❌ Vấn đề

Railway vẫn đang chạy build command cũ có `prisma db push`, gây lỗi:
```
Error: P1001: Can't reach database server
```

## ✅ Giải pháp: Cập nhật Build Command trong Railway Settings

Railway đang dùng Build Command từ **Settings**, không phải từ `railpack.toml`.

### Bước 1: Vào Railway Settings

1. Railway Dashboard → Backend service
2. **Settings** → **Build**

### Bước 2: Cập nhật Build Command

**Xóa command cũ:**
```bash
npm install -g pnpm && pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate && pnpm prisma db push
```

**Thay bằng command mới:**
```bash
pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate
```

### Bước 3: Lưu và Redeploy

1. Click **Save** hoặc **Deploy**
2. Railway sẽ tự động redeploy với build command mới

### Bước 4: Chạy prisma db push thủ công (sau khi deploy thành công)

1. Vào **Deployments** → Click deployment mới nhất
2. Mở **Terminal**
3. Chạy:
   ```bash
   cd packages/api && pnpm prisma db push
   ```

## 📝 Lưu ý

- **KHÔNG** chạy `prisma db push` trong build command
- `prisma generate` chỉ cần schema file, không cần database → an toàn trong build
- `prisma db push` cần kết nối database → chỉ chạy sau khi deploy

## ✅ Build Command đúng

**Nếu Root Directory = trống (root):**
```bash
pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate
```

**Nếu Root Directory = `packages/api`:**
```bash
pnpm install --frozen-lockfile && pnpm prisma generate
```

## 🎯 Start Command

**Nếu Root Directory = trống:**
```bash
cd packages/api && pnpm dev
```

**Nếu Root Directory = `packages/api`:**
```bash
pnpm dev
```

