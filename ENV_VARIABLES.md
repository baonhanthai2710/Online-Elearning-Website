# Environment Variables Reference

## Backend (packages/api/.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/elearning

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
AUTH_COOKIE_NAME=token
BCRYPT_SALT_ROUNDS=10

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

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
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (Image/Video Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Frontend (packages/web)

Trong Vercel, thêm:
```env
VITE_API_URL=https://your-backend.railway.app/api
```

> ⚠️ **Lưu ý**: Vite chỉ expose các biến có prefix `VITE_` ra client-side code.

