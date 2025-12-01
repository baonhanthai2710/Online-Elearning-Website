# Hướng dẫn Deploy E-Learning Platform

## 📋 Tổng quan

Project này sử dụng **monorepo** với:
- **Frontend**: React + Vite (packages/web)
- **Backend**: Express + TypeScript (packages/api)

### 🎯 Các phương án deploy:

**Option 1: Deploy cả FE và BE trên Railway** ✅ (Khuyến nghị - đơn giản nhất)
- Frontend và Backend cùng một platform
- Dễ quản lý và monitor
- Chi phí hợp lý

**Option 2: FE trên Vercel + BE trên Railway/Render**
- Frontend tối ưu với Vercel CDN
- Backend trên Railway/Render
- Cần quản lý 2 platforms

> ⚠️ **Lưu ý**: Backend **KHÔNG nên** deploy lên Vercel vì:
> - Timeout giới hạn (10s Hobby, 60s Pro)
> - Stripe webhooks cần URL công khai ổn định
> - Database connections cần connection pooling
> - Long-running processes (chatbot initialization)

---

## 🚀 PHƯƠNG ÁN 1: Deploy cả FE và BE trên Railway (Khuyến nghị)

### Bước 1: Setup Database

1. **Đăng ký tài khoản Railway**
   - Truy cập: https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo Project mới**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Tạo PostgreSQL Database**
   - Trong project, click "New" → "Database" → "PostgreSQL"
   - Railway sẽ tự động tạo database và cung cấp `DATABASE_URL`
   - Copy `DATABASE_URL` để dùng cho backend service

### Bước 2: Deploy Backend Service

1. **Tạo Backend Service**
   - Trong project, click "New" → "GitHub Repo"
   - Chọn repository của bạn
   - **Settings**:
     - **Name**: `elearning-api` (hoặc tên bạn muốn)
     - **Root Directory**: `packages/api` ⚠️ **HOẶC** để trống (build từ root)
     - **Build Command**: 
       - **Nếu Root Directory = `packages/api`**: 
         ```bash
         npm install -g pnpm && pnpm install --no-frozen-lockfile && pnpm prisma generate && pnpm prisma db push
         ```
       - **Nếu Root Directory = trống (root)**:
         ```bash
         npm install -g pnpm && pnpm install --frozen-lockfile && cd packages/api && pnpm prisma generate && pnpm prisma db push
         ```
     - **Start Command**: 
       - **Nếu Root Directory = `packages/api`**: `pnpm dev`
       - **Nếu Root Directory = trống**: `cd packages/api && pnpm dev`
   
   > 💡 **Khuyến nghị**: Để Root Directory **trống** (build từ root) vì `pnpm-lock.yaml` ở root. Điều này đảm bảo pnpm detect được lockfile.
   
   > ⚠️ **Nếu gặp lỗi "cannot copy to non-directory"**: 
   > - **QUAN TRỌNG**: Vào Railway Settings → **Clear Build Cache** (bắt buộc!)
   > - Railway đang cache `node_modules` cũ, cần clear để build lại từ đầu
   > - File `.dockerignore` đã được tạo để exclude `node_modules`
   > - Sau khi clear cache, Railway sẽ install dependencies mới thay vì copy từ cache
   
   > ⚠️ **QUAN TRỌNG**: Railway có thể tự động detect và dùng `npm` thay vì `pnpm`. Để đảm bảo dùng `pnpm`:
   > - Railway sẽ tự động detect `pnpm-lock.yaml` và dùng `pnpm` (nếu có ở root)
   > - Hoặc cấu hình trong Railway Settings → Variables:
   >   - Thêm: `NIXPACKS_PKG_MANAGER=pnpm`
   > - File `nixpacks.toml` đã được tạo trong `packages/api` để force dùng pnpm

2. **Cấu hình Environment Variables cho Backend**
   - Vào Settings → Variables của backend service
   - Thêm các biến sau:

```env
# Database (Railway tự động tạo, copy từ PostgreSQL service)
DATABASE_URL=postgresql://... 

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
AUTH_COOKIE_NAME=token
BCRYPT_SALT_ROUNDS=10

# Frontend URL (sẽ cập nhật sau khi deploy frontend)
FRONTEND_URL=https://your-frontend.railway.app

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@elearning.vn
FROM_NAME=E-Learning Platform
ADMIN_EMAIL=admin@elearning.vn

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
# ⚠️ CÁCH LẤY GOOGLE_CALLBACK_URL:
# 1. Sau khi deploy backend, vào Railway → Backend service → Settings → Domains
# 2. Copy backend URL (ví dụ: https://elearning-api-production.up.railway.app)
# 3. Thêm /api/auth/google/callback → https://elearning-api-production.up.railway.app/api/auth/google/callback
# 4. Cập nhật URL này vào Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs
# Xem chi tiết: GOOGLE_OAUTH_SETUP.md

# Stripe
STRIPE_SECRET_KEY=sk_live_... (hoặc sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_... (sẽ lấy sau khi setup webhook)

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3001
NODE_ENV=production
```

3. **Chạy Prisma Migrations**
   - Vào Deployments → Click vào deployment mới nhất
   - Mở Terminal
   - Chạy: `pnpm prisma db push` hoặc `pnpm prisma migrate deploy`

4. **Lấy Backend URL**
   - Railway sẽ tự động tạo domain: `https://your-backend.railway.app`
   - Copy URL này để dùng cho frontend

### Bước 3: Deploy Frontend Service

1. **Tạo Frontend Service**
   - Trong cùng project, click "New" → "GitHub Repo"
   - Chọn repository của bạn (lần nữa)
   - **Settings**:
     - **Name**: `elearning-web` (hoặc tên bạn muốn)
     - **Root Directory**: `packages/web`
     - **Build Command**: `pnpm install && pnpm build`
     - **Start Command**: `pnpm start` (sẽ chạy server.js để serve static files)
     - **Watch Paths**: `packages/web/**`

2. **Cấu hình Environment Variables cho Frontend**
   - Vào Settings → Variables của frontend service
   - Thêm:
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   PORT=5174
   NODE_ENV=production
   ```
   > ⚠️ **Lưu ý**: Vite chỉ expose các biến có prefix `VITE_` ra client

3. **Lấy Frontend URL**
   - Railway sẽ tự động tạo domain: `https://your-frontend.railway.app`
   - Copy URL này

### Bước 4: Cập nhật CORS và OAuth Callback

1. **Cập nhật Backend Environment Variables**
   - Quay lại backend service
   - Cập nhật `FRONTEND_URL`:
   ```env
   FRONTEND_URL=https://your-frontend.railway.app
   ```
   - Cập nhật `GOOGLE_CALLBACK_URL`:
   ```env
   GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
   ```
   - Redeploy backend để áp dụng thay đổi

2. **Setup Stripe Webhook**
   - Vào Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-backend.railway.app/api/stripe-webhook`
   - Chọn events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy `Signing secret` → Thêm vào `STRIPE_WEBHOOK_SECRET` trong backend service

### Bước 5: Test

1. **Test Frontend**: Truy cập `https://your-frontend.railway.app`
2. **Test Backend Health**: Truy cập `https://your-backend.railway.app/api/health`
3. **Test Authentication**: Thử đăng ký/đăng nhập
4. **Test Payment**: Sử dụng Stripe test card

---

## 🎨 PHƯƠNG ÁN 2: FE trên Vercel + BE trên Railway/Render

### Bước 1: Deploy Backend (Railway hoặc Render)

### Option A: Railway (Khuyến nghị)

1. **Đăng ký tài khoản Railway**
   - Truy cập: https://railway.app
   - Đăng nhập bằng GitHub

2. **Tạo Project mới**
   - Click "New Project"
   - Chọn "Deploy from GitHub repo"
   - Chọn repository của bạn

3. **Setup Database (PostgreSQL)**
   - Trong project, click "New" → "Database" → "PostgreSQL"
   - Railway sẽ tự động tạo database và cung cấp `DATABASE_URL`

4. **Deploy Backend Service**
   - Click "New" → "GitHub Repo"
   - Chọn repository
   - **Root Directory**: `packages/api`
   - **Build Command**: `pnpm install && pnpm prisma generate && pnpm prisma db push`
   - **Start Command**: `pnpm dev` (hoặc `ts-node src/index.ts`)

5. **Cấu hình Environment Variables**
   - Vào Settings → Variables
   - Thêm các biến sau:

```env
# Database
DATABASE_URL=postgresql://... (Railway tự động tạo)

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
AUTH_COOKIE_NAME=token

# Frontend URL (sẽ cập nhật sau khi deploy frontend)
FRONTEND_URL=https://your-frontend.vercel.app

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@elearning.vn
FROM_NAME=E-Learning Platform
ADMIN_EMAIL=admin@elearning.vn

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-backend.railway.app/api/auth/google/callback
# ⚠️ CÁCH LẤY GOOGLE_CALLBACK_URL:
# 1. Sau khi deploy backend, vào Railway → Backend service → Settings → Domains
# 2. Copy backend URL (ví dụ: https://elearning-api-production.up.railway.app)
# 3. Thêm /api/auth/google/callback → https://elearning-api-production.up.railway.app/api/auth/google/callback
# 4. Cập nhật URL này vào Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs
# Xem chi tiết: GOOGLE_OAUTH_SETUP.md

# Stripe
STRIPE_SECRET_KEY=sk_live_... (hoặc sk_test_...)
STRIPE_WEBHOOK_SECRET=whsec_... (sẽ lấy sau khi setup webhook)

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3001
NODE_ENV=production
BCRYPT_SALT_ROUNDS=10
```

6. **Setup Stripe Webhook**
   - Vào Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-backend.railway.app/api/stripe-webhook`
   - Chọn events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy `Signing secret` → Thêm vào `STRIPE_WEBHOOK_SECRET`

7. **Chạy Prisma Migrations**
   - Vào Deployments → Click vào deployment mới nhất
   - Mở Terminal
   - Chạy: `pnpm prisma db push` hoặc `pnpm prisma migrate deploy`

8. **Lấy Backend URL**
   - Railway sẽ tự động tạo domain: `https://your-project.railway.app`
   - Copy URL này để dùng cho frontend

---

### Option B: Render

1. **Đăng ký tài khoản Render**
   - Truy cập: https://render.com
   - Đăng nhập bằng GitHub

2. **Tạo PostgreSQL Database**
   - Dashboard → "New" → "PostgreSQL"
   - Chọn plan (Free tier có giới hạn)
   - Copy `Internal Database URL` → Dùng làm `DATABASE_URL`

3. **Tạo Web Service (Backend)**
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - **Settings**:
     - **Name**: `elearning-api`
     - **Root Directory**: `packages/api`
     - **Environment**: `Node`
     - **Build Command**: `cd packages/api && pnpm install && pnpm prisma generate && pnpm prisma db push`
     - **Start Command**: `cd packages/api && pnpm dev`
     - **Plan**: Free (hoặc Starter nếu cần)

4. **Cấu hình Environment Variables** (giống Railway ở trên)

5. **Setup Stripe Webhook** (giống Railway)

---

### Bước 2: Deploy Frontend (Vercel)

1. **Đăng ký tài khoản Vercel**
   - Truy cập: https://vercel.com
   - Đăng nhập bằng GitHub

2. **Import Project**
   - Dashboard → "Add New" → "Project"
   - Chọn repository của bạn
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/web`
   - **Build Command**: `pnpm install && pnpm build` (hoặc để Vercel tự detect)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

3. **Cấu hình Environment Variables**
   - Vào Settings → Environment Variables
   - Thêm:
   ```env
   VITE_API_URL=https://your-backend.railway.app/api
   ```
   > ⚠️ **Lưu ý**: Vite chỉ expose các biến có prefix `VITE_` ra client

4. **Deploy**
   - Click "Deploy"
   - Vercel sẽ tự động build và deploy
   - Sau khi deploy xong, copy URL: `https://your-project.vercel.app`

5. **Cập nhật Backend CORS**
   - Quay lại Railway/Render
   - Cập nhật `FRONTEND_URL` trong Environment Variables:
   ```env
   FRONTEND_URL=https://your-project.vercel.app
   ```
   - Redeploy backend để áp dụng thay đổi

---

## ✅ Kiểm tra và Test

1. **Test Frontend**
   - Truy cập: `https://your-project.vercel.app`
   - Kiểm tra xem có kết nối được với backend không

2. **Test Backend Health**
   - Truy cập: `https://your-backend.railway.app/api/health`
   - Phải trả về: `{"status":"ok"}`

3. **Test Authentication**
   - Thử đăng ký/đăng nhập
   - Kiểm tra JWT token có được lưu không

4. **Test Payment (Stripe)**
   - Sử dụng test card: `4242 4242 4242 4242`
   - Kiểm tra webhook có nhận được event không

---

## 🔧 Troubleshooting

### Frontend không kết nối được với Backend

- Kiểm tra `VITE_API_URL` trong Vercel Environment Variables
- Kiểm tra CORS settings trong backend (`FRONTEND_URL`)
- Mở Browser DevTools → Network tab để xem lỗi cụ thể

### Backend lỗi Database Connection

- Kiểm tra `DATABASE_URL` trong Railway/Render
- Chạy `pnpm prisma db push` để sync schema
- Kiểm tra database có đang chạy không

### Stripe Webhook không hoạt động

- Kiểm tra `STRIPE_WEBHOOK_SECRET` đã đúng chưa
- Kiểm tra webhook endpoint URL trong Stripe Dashboard
- Xem logs trong Railway/Render để debug

### Email không gửi được

- Kiểm tra SMTP credentials
- Với Gmail, cần dùng "App Password" thay vì mật khẩu thường
- Kiểm tra `SMTP_USER` và `SMTP_PASS` đã đúng chưa

---

## 📝 Checklist trước khi Deploy

- [ ] Database đã được tạo và migrate
- [ ] Tất cả Environment Variables đã được cấu hình
- [ ] Stripe webhook đã được setup
- [ ] Google OAuth callback URL đã được cập nhật
- [ ] Cloudinary credentials đã được thêm
- [ ] Frontend `VITE_API_URL` trỏ đúng backend URL
- [ ] Backend `FRONTEND_URL` trỏ đúng frontend URL
- [ ] Test đăng ký/đăng nhập thành công
- [ ] Test payment flow thành công

---

## 🎯 Production Best Practices

1. **Security**
   - Sử dụng strong `JWT_SECRET` (ít nhất 32 ký tự random)
   - Enable HTTPS cho cả frontend và backend
   - Set `NODE_ENV=production`
   - Review và giới hạn CORS origins

2. **Performance**
   - Enable caching cho static assets
   - Sử dụng CDN cho images (Cloudinary)
   - Optimize database queries (indexes)
   - Monitor API response times

3. **Monitoring**
   - Setup error tracking (Sentry, LogRocket)
   - Monitor database performance
   - Track API usage và costs
   - Setup alerts cho downtime

4. **Backup**
   - Regular database backups
   - Version control cho code
   - Document all environment variables

---

## 📚 Tài liệu tham khảo

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

## 💡 Tips

- **Free Tier Limits**:
  - Vercel: Unlimited cho personal projects
  - Railway: $5 credit/tháng (đủ cho cả FE và BE nếu traffic thấp)
  - Render: Free tier có giới hạn (sleep sau 15 phút không dùng)

- **So sánh phương án deploy**:
  - **Railway (cả FE + BE)**: ✅ Đơn giản, dễ quản lý, chi phí hợp lý, tốt cho MVP
  - **Vercel (FE) + Railway (BE)**: ✅ Frontend tối ưu với CDN, phù hợp production scale lớn

- **Cost Optimization**:
  - Deploy cả FE và BE trên Railway tiết kiệm hơn (chỉ 1 platform)
  - Optimize images trước khi upload lên Cloudinary
  - Monitor Stripe API calls
  - Sử dụng Railway's free tier cho development/testing

- **Development Workflow**:
  - Giữ `.env.local` cho development
  - Sử dụng Git branches cho staging/production
  - Test trên staging trước khi deploy production
  - Railway tự động deploy khi push code lên GitHub (nếu enable)

