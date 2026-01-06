# 🛡️ सुरक्षा दृष्टि (Suraksha Drishti)

**AI-Powered Security Surveillance System**  
Government of India Initiative

## ✅ Features

- **Live Webcam Access** - Works directly in browser
- **Video Upload** - Analyze pre-recorded videos
- **Real-time Threat Detection** - AI-powered analysis
- **Violence Detection** - Behavioral pattern recognition
- **Weapon Detection** - Identifies dangerous objects
- **People Analytics** - Face detection and counting
- **Professional UI** - Government-style interface
- **Real-time Charts** - Threat level visualization
- **Alert System** - Instant notifications

## 🚀 Quick Start

### Option 1: Open Directly (No Installation)

1. Simply open `index.html` in any modern browser
2. Click "Start Monitoring"
3. Allow webcam access when prompted
4. System starts analyzing in real-time!

### Option 2: Deploy to Vercel/Netlify

1. Create account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. Upload this folder or connect GitHub repo
3. Deploy with one click
4. Share the live URL!

### Option 3: Local Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000
```

## 📁 Project Structure

```
suraksha-drishti-web/
├── index.html          # Main HTML file
├── style.css           # Professional styling
├── app.js              # Core application logic
├── README.md           # This file
├── vercel.json         # Vercel deployment config
└── netlify.toml        # Netlify deployment config
```

## 🎯 How It Works

1. **Browser Access** - JavaScript accesses webcam using WebRTC
2. **Frame Capture** - Captures video frames in real-time
3. **AI Processing** - Analyzes frames for threats (simulated in demo)
4. **Real-time Display** - Shows results instantly
5. **Alert System** - Notifies on threat detection

## 🔧 Technologies Used

- **HTML5** - Structure
- **CSS3** - Professional styling
- **JavaScript (ES6+)** - Core logic
- **WebRTC** - Webcam access
- **Canvas API** - Frame processing
- **Chart.js** - Data visualization
- **TensorFlow.js** - AI models (ready to integrate)

## 📊 Current Status

✅ **Working Features:**
- Webcam access in browser
- Video file upload
- Real-time video display
- Professional UI
- Statistics dashboard
- Alert system
- Threat level charts

⚠️ **Demo Mode:**
- Currently uses simulated detection
- Ready for TensorFlow.js model integration
- Models can be added without backend

## 🔮 Adding Real AI Models

To integrate actual AI detection:

1. Convert your models to TensorFlow.js format:
```bash
tensorflowjs_converter --input_format=keras model.h5 tfjs_model/
```

2. Load models in `app.js`:
```javascript
const model = await tf.loadLayersModel('tfjs_model/model.json');
```

3. Replace `simulateDetection()` with actual inference

## 🌐 Deployment Options

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Get instant live URL!

### Netlify
1. Drag & drop folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get instant live URL!

### GitHub Pages
1. Push to GitHub repo
2. Enable GitHub Pages in settings
3. Select main branch
4. Access at: `username.github.io/repo-name`

## 🎥 Demo

The system works with:
- ✅ Any webcam (laptop, external, phone)
- ✅ Uploaded video files (MP4, AVI, MOV)
- ✅ All modern browsers (Chrome, Firefox, Edge, Safari)

## 🔒 Privacy & Security

- All processing happens in browser
- No data sent to external servers
- Webcam access requires user permission
- Works completely offline (after initial load)

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Edge 79+
- ✅ Safari 11+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🆘 Troubleshooting

**Webcam not working?**
- Check browser permissions
- Ensure HTTPS (required for webcam)
- Try different browser

**Video not uploading?**
- Check file format (MP4, AVI, MOV)
- Ensure file size < 100MB
- Try different video

**Page not loading?**
- Check internet connection (for CDN libraries)
- Clear browser cache
- Try incognito mode

## 📄 License

Government of India Initiative - Educational Purpose

## 👨‍💻 Support

For issues or questions, contact your project supervisor.

---

**Made with ❤️ for Suraksha Drishti Initiative**
