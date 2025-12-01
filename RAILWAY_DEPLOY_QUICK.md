# 🚀 Deploy cả FE và BE trên Railway - Hướng dẫn nhanh

## ✅ Có thể deploy cả FE và BE trên Railway!

Railway hỗ trợ deploy nhiều services trong cùng một project, rất phù hợp cho monorepo.

---

## 📋 Checklist nhanh

### 1. Setup Database
- [ ] Tạo PostgreSQL database trong Railway project
- [ ] Copy `DATABASE_URL`

### 2. Deploy Backend
- [ ] Tạo service mới: Root Directory = `packages/api`
- [ ] Build Command: `pnpm install && pnpm prisma generate && pnpm prisma db push`
- [ ] Start Command: `pnpm dev`
- [ ] Thêm tất cả environment variables (xem `ENV_VARIABLES.md`)
- [ ] Copy backend URL: `https://your-backend.railway.app`

### 3. Deploy Frontend
- [ ] Tạo service mới: Root Directory = `packages/web`
- [ ] Build Command: `pnpm install && pnpm build`
- [ ] Start Command: `pnpm start`
- [ ] Environment Variables:
  - `VITE_API_URL=https://your-backend.railway.app/api`
  - `PORT=5174`
  - `NODE_ENV=production`
- [ ] Copy frontend URL: `https://your-frontend.railway.app`

### 4. Cập nhật CORS
- [ ] Cập nhật `FRONTEND_URL` trong backend service
- [ ] Cập nhật `GOOGLE_CALLBACK_URL` trong backend service
- [ ] Redeploy backend

### 5. Setup Stripe Webhook
- [ ] Thêm webhook endpoint: `https://your-backend.railway.app/api/stripe-webhook`
- [ ] Copy signing secret → thêm vào `STRIPE_WEBHOOK_SECRET`

---

## 🎯 Lợi ích deploy cả trên Railway

✅ **Đơn giản**: Chỉ cần quản lý 1 platform  
✅ **Tiết kiệm**: Chỉ trả tiền cho 1 service (nếu dùng free tier)  
✅ **Dễ monitor**: Xem logs của cả FE và BE ở cùng một nơi  
✅ **Tự động deploy**: Railway tự động deploy khi push code  
✅ **Environment variables**: Dễ share giữa các services  

---

## ⚠️ Lưu ý

- Railway free tier: $5 credit/tháng
- Mỗi service sẽ có URL riêng (frontend và backend khác nhau)
- Cần cấu hình CORS đúng `FRONTEND_URL`
- Frontend cần `VITE_API_URL` trỏ đúng backend URL

---

## 📚 Xem thêm

- Chi tiết đầy đủ: `DEPLOY.md` (Phương án 1)
- Environment variables: `ENV_VARIABLES.md`

