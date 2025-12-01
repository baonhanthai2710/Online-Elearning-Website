# 🔍 Cách lấy DATABASE_URL từ Railway

## 📋 DATABASE_URL Format

DATABASE_URL phải có format đầy đủ:
```
postgresql://user:password@host:port/database
```

## 🚀 Cách lấy DATABASE_URL từ Railway

### Cách 1: Từ PostgreSQL Service Variables (Khuyến nghị - Dễ nhất) ✅

1. **Vào Railway Dashboard**
2. **Tìm PostgreSQL service** (database service)
3. **Click vào PostgreSQL service**
4. **Vào tab Variables** (hoặc **Settings** → **Variables**)
5. **Tìm `DATABASE_URL`** hoặc `POSTGRES_URL` hoặc `PGDATABASE`
6. **Copy toàn bộ URL** - sẽ có dạng:
   ```
   postgresql://postgres:password@postgres-production-d144.up.railway.app:5432/railway
   ```
   hoặc
   ```
   postgresql://postgres:password@postgres.railway.internal:5432/railway
   ```

### Cách 2: Tạo từ thông tin có sẵn

Nếu bạn có:
- **Host**: `postgres-production-d144.up.railway.app`
- **Port**: `5432` (mặc định cho PostgreSQL)
- **User**: `postgres` (mặc định)
- **Password**: Lấy từ Railway Variables (tìm `PGPASSWORD` hoặc trong DATABASE_URL)
- **Database**: `railway` (mặc định) hoặc tên database của bạn

**Tạo URL:**
```
postgresql://postgres:YOUR_PASSWORD@postgres-production-d144.up.railway.app:5432/railway
```

**Lấy Password:**
- Vào PostgreSQL service → **Variables**
- Tìm `PGPASSWORD` hoặc xem trong `DATABASE_URL` đã có sẵn

### Cách 2: Từ Connection Info

1. **Vào PostgreSQL service**
2. **Tìm tab "Data"** hoặc **"Connection"**
3. **Xem Connection Info** hoặc **Connection String**
4. **Copy DATABASE_URL** từ đó

### Cách 3: Tạo từ thông tin riêng lẻ

Nếu chỉ có các thông tin riêng lẻ:
- Host: `tramway.proxy.rlwy.net`
- Port: `13960`
- User: `postgres`
- Password: (từ Railway)
- Database: `railway`

Tạo URL:
```
postgresql://postgres:YOUR_PASSWORD@tramway.proxy.rlwy.net:13960/railway
```

## ⚠️ Lưu ý

- **Internal URL** (`postgres.railway.internal:5432`): Chỉ hoạt động trong Railway network
- **Public Proxy URL** (`tramway.proxy.rlwy.net:13960`): Có thể truy cập từ bên ngoài
- **DATABASE_URL** phải đầy đủ, không chỉ host:port

## ✅ Sau khi có DATABASE_URL

1. **Vào Backend service** → **Settings** → **Variables**
2. **Thêm hoặc cập nhật** `DATABASE_URL`:
   ```
   DATABASE_URL=postgresql://postgres:password@tramway.proxy.rlwy.net:13960/railway
   ```
3. **Save**
4. **Redeploy** backend service

## 🔧 Kiểm tra DATABASE_URL

Sau khi set DATABASE_URL, có thể test bằng:
```bash
railway run pnpm --filter api prisma db push
```

Nếu vẫn lỗi, đảm bảo:
- DATABASE_URL đã được set trong Railway Variables
- URL có format đúng: `postgresql://user:password@host:port/database`
- Database service đang chạy

