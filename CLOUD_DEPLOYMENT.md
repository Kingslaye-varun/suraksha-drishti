# 🛡️ Suraksha Drishti - Cloud Deployment Guide

## Complete Cloud Deployment with REAL AI Models

This guide will help you deploy the ENTIRE system to the cloud with your actual trained models.

---

## 📋 What We're Deploying

1. **Frontend** → Vercel (HTML/CSS/JS)
2. **Backend API** → Render (Python + AI Models)
3. **Models** → Included in backend deployment

---

## 🚀 STEP 1: Deploy Backend to Render (FREE)

### Why Render?
- ✅ Free tier available
- ✅ Supports Python
- ✅ Can handle large model files
- ✅ Easy deployment

### Steps:

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Deploy from Git URL"

3. **Configure Service**
   ```
   Name: suraksha-drishti-api
   Environment: Python 3
   Build Command: pip install -r api/requirements.txt
   Start Command: cd api && gunicorn app:app
   Instance Type: Free
   ```

4. **Add Environment Variables** (if needed)
   ```
   PYTHON_VERSION=3.11
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://suraksha-drishti-api.onrender.com`

6. **Test Backend**
   - Visit: `https://your-app.onrender.com/api/health`
   - Should show: `{"status": "ok", "models": {...}}`

---

## 🌐 STEP 2: Deploy Frontend to Vercel

### Steps:

1. **Update API URL in app.js**
   - Open `app.js`
   - Find line with `API_URL`
   - Replace with your Render URL:
   ```javascript
   const API_URL = 'https://your-render-app.onrender.com/api/detect';
   ```

2. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Or drag & drop the folder
   - Click "Deploy"

3. **Get Your URL**
   - You'll get: `https://suraksha-drishti.vercel.app`
   - Share this with your professor!

---

## 🔧 ALTERNATIVE: Deploy Backend to Railway

Railway is another free option:

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects Python
6. Add start command: `cd api && gunicorn app:app`
7. Deploy!

---

## 📦 Model Files Handling

Your models are already in `api/models/`:
- ✅ mobilenet_feature_extractor.tflite (2.4 MB)
- ✅ violence_detection_lstm.h5 (1.6 MB)
- ✅ gender_classification.tflite (2.6 MB)
- ✅ yolov8n.pt (6.2 MB)

**Total: ~13 MB** - Well within free tier limits!

---

## 🎯 Quick Deployment (Using Git)

```bash
# 1. Initialize git (if not done)
cd suraksha-drishti-web
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit - Suraksha Drishti with AI models"

# 4. Create GitHub repo
# Go to github.com → New Repository → "suraksha-drishti"

# 5. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/suraksha-drishti.git
git branch -M main
git push -u origin main

# 6. Deploy backend to Render (connect GitHub repo)
# 7. Deploy frontend to Vercel (connect GitHub repo)
```

---

## ✅ Testing Your Deployment

### Test Backend:
```bash
# Health check
curl https://your-app.onrender.com/api/health

# Should return:
{
  "status": "ok",
  "models": {
    "cnn": true,
    "lstm": true,
    "gender": true,
    "yolo": true,
    "face": true
  }
}
```

### Test Frontend:
1. Visit your Vercel URL
2. Click "Start Monitoring"
3. Allow webcam
4. Check browser console (F12)
5. Should see API calls to Render backend

---

## 🐛 Troubleshooting

### Backend Issues:

**"Build failed"**
- Check `requirements.txt` is in `api/` folder
- Ensure Python 3.11 is selected
- Check build logs for specific errors

**"Models not loading"**
- Verify models are in `api/models/` folder
- Check file sizes (should be ~13 MB total)
- Look at deployment logs

**"Out of memory"**
- Free tier has 512 MB RAM
- Models should fit, but if not:
  - Use Railway (1 GB RAM free tier)
  - Or upgrade Render plan

### Frontend Issues:

**"CORS error"**
- Backend has `flask-cors` installed
- Check it's in requirements.txt
- Restart backend if needed

**"API call failed"**
- Check backend URL in app.js
- Ensure backend is running
- Check browser console for exact error

**"Webcam not working"**
- Vercel uses HTTPS (required for webcam)
- Check browser permissions
- Try different browser

---

## 💰 Cost Breakdown

### FREE TIER:
- ✅ Render: 750 hours/month free
- ✅ Vercel: Unlimited bandwidth
- ✅ GitHub: Free for public repos

### PAID (if needed):
- Render Starter: $7/month (more RAM)
- Vercel Pro: $20/month (more features)

**Recommendation: Start with FREE tier!**

---

## 📊 Performance Notes

### First Request:
- Render free tier "sleeps" after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

### Solution:
- Keep backend awake with ping service
- Or upgrade to paid tier (no sleep)

---

## 🎓 For Your Professor

Share these URLs:
1. **Live Demo**: `https://your-app.vercel.app`
2. **Backend API**: `https://your-app.onrender.com/api/health`
3. **GitHub Repo**: `https://github.com/your-username/suraksha-drishti`

Explain:
- Frontend hosted on Vercel (HTML/CSS/JS)
- Backend hosted on Render (Python + AI)
- Real AI models deployed and working
- Webcam access works in browser
- All detection is real-time

---

## 📝 Final Checklist

Before submitting:

- [ ] Backend deployed to Render
- [ ] Backend health check works
- [ ] Frontend deployed to Vercel
- [ ] API URL updated in app.js
- [ ] Webcam access works
- [ ] AI detection working
- [ ] Test with different scenarios
- [ ] Record demo video
- [ ] Share URLs with professor

---

## 🆘 Need Help?

If deployment fails:

1. Check deployment logs (Render/Vercel dashboard)
2. Verify all files are committed to Git
3. Ensure models are in correct folder
4. Test locally first (python api/app.py)
5. Check browser console for errors

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Professional web app
- ✅ Real AI models running
- ✅ Webcam access working
- ✅ Shareable URL
- ✅ Production-ready system

**Your project is now live on the internet!** 🚀

---

## 📞 Support

For issues:
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Flask CORS: https://flask-cors.readthedocs.io

---

**Good luck with your submission!** 🛡️
