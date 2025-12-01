# 🖥️ Cách mở Terminal trên Railway

## ❌ Vấn đề

Không tìm thấy Terminal trong Railway để chạy `prisma db push`.

## ✅ Giải pháp

### Cách 1: Railway CLI (Khuyến nghị - Dễ nhất) ✅

Railway CLI cho phép chạy commands từ máy local của bạn.

#### Bước 1: Cài Railway CLI

```bash
npm i -g @railway/cli
```

Hoặc với pnpm:
```bash
pnpm add -g @railway/cli
```

#### Bước 2: Login

```bash
railway login
```

Sẽ mở browser để login với Railway account.

#### Bước 3: Link project

```bash
railway link
```

Chọn:
- Project của bạn
- Service: `elearning-api` (backend service)

#### Bước 4: Chạy prisma db push

**Kiểm tra Root Directory trước:**
- Vào Railway Dashboard → Backend service → Settings → Build
- Xem **Root Directory** là gì:
  - Nếu = `packages/api` → Dùng command 1
  - Nếu = trống (root) → Dùng command 2

**Command 1: Nếu Root Directory = `packages/api`**
```bash
railway run pnpm prisma db push
```

**Command 2: Nếu Root Directory = trống (root)**
```bash
railway run pnpm --filter api prisma db push
```

**Command 3: Dùng bash (nếu command trên không hoạt động)**
```bash
railway run bash -c "cd packages/api && pnpm prisma db push"
```

**Command 4: Chỉ định service cụ thể**
```bash
railway run --service your-service-name pnpm prisma db push
```

> ⚠️ **Nếu vẫn lỗi**: Railway CLI có thể không hoạt động tốt với monorepo. Dùng **Cách 3** (thêm vào Start Command) thay thế.

### Cách 2: Tìm Terminal trong Railway Dashboard

1. **Vào backend service**
2. **Tìm tab Terminal/Console:**
   - Có thể ở **sidebar bên trái**
   - Hoặc trong **Deployments** → Click deployment → Tìm **Terminal**
   - Hoặc trong **Settings** → Tìm **Terminal** hoặc **Console**
   - Hoặc click vào **service name** → Scroll xuống tìm **Terminal**

3. **Nếu không thấy:**
   - Railway có thể không có Terminal trong free tier
   - Hoặc Terminal chỉ có trong một số plan nhất định
   - → Dùng Railway CLI (Cách 1) thay thế

### Cách 3: Thêm vào Start Command (Tạm thời)

Nếu không thể dùng Terminal, có thể thêm vào Start Command tạm thời:

1. **Vào Settings → Build**
2. **Cập nhật Start Command:**
   ```bash
   cd packages/api && pnpm prisma db push && pnpm dev
   ```
3. **Redeploy**
4. **Sau khi chạy xong**, đổi lại Start Command về:
   ```bash
   cd packages/api && pnpm dev
   ```

> ⚠️ **Lưu ý**: Cách này sẽ chạy `prisma db push` mỗi lần start, không tối ưu. Chỉ dùng tạm thời.

### Cách 4: Dùng Railway API (Advanced)

Có thể dùng Railway API để chạy commands, nhưng phức tạp hơn. Khuyến nghị dùng Railway CLI.

## 🎯 Khuyến nghị

**Dùng Railway CLI (Cách 1)** vì:
- ✅ Dễ sử dụng
- ✅ Chạy từ máy local
- ✅ Không phụ thuộc vào giao diện Railway
- ✅ Hoạt động với mọi plan

## 📝 Sau khi chạy prisma db push

Sau khi chạy thành công, bạn sẽ thấy:
```
✔ Your database is now in sync with your Prisma schema.
```

Lúc này database đã được sync và backend có thể kết nối được.

