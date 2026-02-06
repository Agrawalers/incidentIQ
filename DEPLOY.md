# 🚀 Deploying IncidentIQ to Render.com (Free Tier)

This guide walks you through deploying both the backend and frontend on Render.com's free tier.

---

## 📋 Prerequisites

1. **GitHub Account** with your code pushed to: `https://github.com/Agrawalers/incidentIQ.git`
2. **Render.com Account** (sign up at https://render.com)
3. **Groq API Key** (get from https://console.groq.com/keys)

---

## 🔧 Part 1: Deploy Backend (Python Web Service)

### Step 1: Sign Up / Log In to Render.com

1. Go to https://render.com
2. Click **"Get Started for Free"** or **"Sign In"**
3. Sign up using your **GitHub account** (recommended for easy repo access)

### Step 2: Connect GitHub Repository

1. After logging in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** if not already connected
4. Authorize Render to access your GitHub repositories
5. Find and select **"incidentIQ"** repository
6. Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `incidentiq-backend` (or any unique name) |
| **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r ../requirements.txt` |
| **Start Command** | `uvicorn api:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `your_actual_groq_api_key_here` |
| `PYTHON_VERSION` | `3.11.0` |

**Important**: Replace `your_actual_groq_api_key_here` with your real Groq API key from https://console.groq.com/keys

### Step 5: Deploy Backend

1. Click **"Create Web Service"** button at the bottom
2. Render will start building and deploying your backend
3. Wait 5-10 minutes for the build to complete
4. Once deployed, you'll see a green **"Live"** status
5. **Copy the backend URL** (e.g., `https://incidentiq-backend.onrender.com`)

---

## 🎨 Part 2: Deploy Frontend (Static Site)

### Step 1: Create New Static Site

1. Click **"New +"** button again
2. Select **"Static Site"**
3. Select your **"incidentIQ"** repository again
4. Click **"Connect"**

### Step 2: Configure Frontend Service

Fill in the following settings:

| Field | Value |
|-------|-------|
| **Name** | `incidentiq-frontend` (or any unique name) |
| **Region** | Same as backend (for lower latency) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: Add Environment Variable

Scroll down to **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://incidentiq-backend.onrender.com` |

**Important**: Replace with your actual backend URL from Part 1, Step 5 (without trailing slash)

### Step 4: Deploy Frontend

1. Click **"Create Static Site"** button
2. Wait 3-5 minutes for build and deployment
3. Once deployed, you'll see a green **"Live"** status
4. **Copy the frontend URL** (e.g., `https://incidentiq-frontend.onrender.com`)

---

## ✅ Part 3: Verify Deployment

### Test Backend

1. Open your backend URL in browser: `https://incidentiq-backend.onrender.com/docs`
2. You should see the **FastAPI Swagger UI** documentation
3. Try the `/health` endpoint to verify it's working

### Test Frontend

1. Open your frontend URL in browser: `https://incidentiq-frontend.onrender.com`
2. You should see the **IncidentIQ UI** with intro animation
3. Try submitting a test incident:
   ```
   Database connection pool exhausted causing transaction timeouts.
   Multiple pods restarted under high traffic.
   ```
4. Verify you get a response with classification, similar incidents, and analysis

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Build fails with "No module named 'sentence_transformers'"
- **Solution**: Check that `requirements.txt` is in the root directory, not inside `backend/`
- Update Build Command to: `pip install -r ../requirements.txt`

**Problem**: Backend shows "Application failed to respond"
- **Solution**: Check Start Command is: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- Verify `GROQ_API_KEY` environment variable is set correctly

**Problem**: CORS errors in browser console
- **Solution**: Backend `api.py` already has CORS configured for all origins (`allow_origins=["*"]`)
- If issue persists, add your frontend URL explicitly to `allow_origins` list

### Frontend Issues

**Problem**: Frontend shows blank page
- **Solution**: Check browser console for errors
- Verify `VITE_API_URL` environment variable is set correctly (no trailing slash)

**Problem**: API calls fail with network error
- **Solution**: Verify backend is deployed and running (green "Live" status)
- Check that `VITE_API_URL` matches your backend URL exactly

**Problem**: Build fails with npm errors
- **Solution**: Render uses Node 14 by default. Add environment variable:
  - Key: `NODE_VERSION`
  - Value: `18.17.0`

---

## 💡 Free Tier Limitations

### Backend (Web Service)
- **RAM**: 512 MB
- **CPU**: Shared
- **Bandwidth**: 100 GB/month
- **Downtime**: Spins down after 15 minutes of inactivity (cold start ~30 seconds)

### Frontend (Static Site)
- **Bandwidth**: 100 GB/month
- **Always on**: No cold starts

### Tips to Stay Within Free Tier
1. Backend will sleep after 15 min inactivity - first request after sleep takes ~30 seconds
2. Keep backend awake by pinging `/health` endpoint every 10 minutes (optional)
3. FAISS index (~700MB with sentence-transformers) loads into memory on startup

---

## 🔄 Updating Your Deployment

### Auto-Deploy (Recommended)

Render automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both services will rebuild and redeploy automatically.

### Manual Deploy

1. Go to Render Dashboard
2. Select your service (backend or frontend)
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔐 Security Notes

1. **Never commit `.env` files** - they're in `.gitignore`
2. **Use environment variables** on Render for all secrets
3. **Rotate API keys** if accidentally exposed
4. **CORS is open** (`allow_origins=["*"]`) - restrict in production if needed

---

## 📊 Monitoring

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab to see real-time logs
4. Useful for debugging errors

### Check Metrics

1. Click **"Metrics"** tab
2. View CPU, memory, and bandwidth usage
3. Monitor for free tier limits

---

## 🎯 Next Steps

1. ✅ Backend deployed and accessible
2. ✅ Frontend deployed and connected to backend
3. ✅ Test with sample incidents
4. 🚀 Share your live URL: `https://incidentiq-frontend.onrender.com`

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: https://github.com/Agrawalers/incidentIQ/issues

---

**Built by Kushagra Agrawal** 🚀
