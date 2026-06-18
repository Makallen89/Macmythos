# 🚀 Mac Mythos — Production-Ready Admin Dashboard

Complete full-stack admin dashboard with FastAPI backend, React frontend, PostgreSQL database, Redis cache, and real-time WebSocket support.

## 📁 Project Structure

```
mac-mythos-admin/
├── backend/              # FastAPI + PostgreSQL + Redis
│   ├── main.py           # Main API application
│   ├── requirements.txt  # Python dependencies
│   ├── Dockerfile        # Backend container
│   ├── docker-compose.yml # Local dev stack
│   └── .env.example      # Environment template
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # Dashboard, Users, Workspaces, Tickets, Analytics, Settings
│   │   ├── components/   # Layout, Sidebar
│   │   ├── store/        # Zustand auth store
│   │   └── utils/        # API client
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── deploy/               # Production deployment files
│   ├── docker-compose.prod.yml
│   ├── netlify.toml
│   ├── wrangler.toml
│   ├── railway.toml
│   ├── render.yaml
│   ├── nginx.conf
│   └── .env
└── .github/workflows/    # CI/CD pipelines
    └── deploy.yml
```

## 🛠️ Local Development

### Option 1: Docker Compose (Recommended)
```bash
cd backend
docker-compose up -d
# API runs on http://localhost:8000
# PostgreSQL on localhost:5432
# Redis on localhost:6379

cd frontend
npm install
npm run dev
# Frontend on http://localhost:3000
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DB credentials
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 🔐 Default Login
- **Email:** `admin@macmythos.com`
- **Password:** `admin123`

## 🌐 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Login |
| `/api/auth/register` | POST | No | Register |
| `/api/auth/me` | GET | Yes | Current user |
| `/api/users` | GET/POST | Admin | List/Create users |
| `/api/users/{id}` | PATCH/DELETE | Admin | Update/Delete user |
| `/api/workspaces` | GET/POST | Admin | List/Create workspaces |
| `/api/tickets` | GET/POST | Admin/User | List/Create tickets |
| `/api/tickets/{id}` | PATCH | Admin | Update ticket |
| `/api/dashboard/stats` | GET | Admin | Dashboard statistics |
| `/api/dashboard/activity` | GET | Admin | Recent activity |
| `/api/dashboard/chart-data` | GET | Admin | Chart data |
| `/ws` | WS | No | Real-time updates |
| `/health` | GET | No | Health check |

## 🚀 Deployment Options

### 1. Docker Compose (VPS/Dedicated Server)
```bash
cd deploy
cp .env .env.local  # Edit with your values
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Netlify (Frontend Only)
```bash
cd frontend
npm install
npm run build
# Deploy `dist/` folder to Netlify
# Set VITE_API_URL in Netlify environment variables
```

### 3. Cloudflare Pages
```bash
cd frontend
npm install
npm run build
npx wrangler pages deploy dist
```

### 4. Railway (Backend + DB)
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway init
railway up
```

### 5. Render
```bash
# Connect GitHub repo to Render
# Use render.yaml for blueprint deployment
```

## 🔧 Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | Required |
| `DATABASE_URL` | PostgreSQL connection | Required |
| `REDIS_URL` | Redis connection | Required |
| `AWS_ACCESS_KEY_ID` | S3 access key | Optional |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key | Optional |
| `AWS_BUCKET_NAME` | S3 bucket | Optional |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## 🎨 Features

- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (Admin/User)
- ✅ Real-time WebSocket updates
- ✅ PostgreSQL with auto-migration
- ✅ Redis caching
- ✅ File uploads (local/S3)
- ✅ Responsive design
- ✅ Dark theme
- ✅ Interactive charts (Recharts)
- ✅ CRUD operations for Users, Workspaces, Tickets
- ✅ Dashboard with live stats
- ✅ Activity logging
- ✅ Health checks
- ✅ Docker containerization
- ✅ CI/CD ready

## 📜 License
MIT
