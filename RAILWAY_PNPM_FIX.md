# 🔧 Fix Railway pnpm Deployment

## ❌ Vấn đề

Railway đang dùng **Railpack** (không phải Nixpacks) và:
- Không có `pnpm` được cài sẵn
- Vẫn detect `npm` thay vì `pnpm`
- Build command dùng `pnpm` nhưng `pnpm: not found`

## ✅ Giải pháp

### Cách 1: Cấu hình Build Command trong Railway Settings (Khuyến nghị)

1. **Vào Railway Dashboard**
   - Chọn backend service của bạn
   - Vào **Settings** → **Build**

2. **Cập nhật Build Command**:
   ```bash
   npm install -g pnpm && pnpm install --frozen-lockfile && pnpm prisma generate && pnpm prisma db push
   ```

3. **Cập nhật Start Command**:
   ```bash
   pnpm dev
   ```

4. **Redeploy**

### Cách 2: Thêm Environment Variable

1. **Vào Railway Settings → Variables**
2. **Thêm biến**:
   ```
   NIXPACKS_PKG_MANAGER=pnpm
   ```
   hoặc
   ```
   RAILPACK_PKG_MANAGER=pnpm
   ```

3. **Redeploy**

### Cách 3: Tạo package.json ở root (nếu cần)

Nếu Railway không detect `pnpm-lock.yaml` ở root, có thể tạo `package.json` ở root với script install pnpm:

```json
{
  "scripts": {
    "postinstall": "npm install -g pnpm"
  }
}
```

## 🔍 Kiểm tra

Sau khi redeploy, xem logs và tìm:
- ✅ `npm install -g pnpm` - pnpm được cài
- ✅ `pnpm install` - pnpm được dùng
- ❌ `npm ci` hoặc `npm install` - vẫn dùng npm (chưa fix)

## 📝 Lưu ý

- Railway có thể cache build, nên có thể cần **Clear Build Cache** trong Settings
- Nếu vẫn lỗi, thử **Delete và tạo lại service** với Build Command mới ngay từ đầu
- Đảm bảo `pnpm-lock.yaml` có ở **root** của repo (không phải trong `packages/api`)

## 🎯 Build Command đầy đủ

### Option 1: Build từ Root (Khuyến nghị) ✅

**Root Directory**: Để trống (root của repo)

**Build Command**:
```bash
npm install -g pnpm && pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate && pnpm prisma db push
```

**Start Command**:
```bash
cd packages/api && pnpm dev
```

### Option 2: Build từ packages/api

**Root Directory**: `packages/api`

**Build Command**:
```bash
npm install -g pnpm && pnpm install --no-frozen-lockfile && pnpm prisma generate && pnpm prisma db push
```

**Start Command**:
```bash
pnpm dev
```

> ⚠️ **Lưu ý**: Option 2 dùng `--no-frozen-lockfile` vì `pnpm-lock.yaml` không có trong `packages/api`. Option 1 tốt hơn vì có lockfile.

