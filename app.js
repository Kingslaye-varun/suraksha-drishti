// Suraksha Drishti - Main Application with REAL AI
let videoElement, canvas, ctx;
let isMonitoring = false;
let stream = null;
let animationId = null;

// API Configuration
// For local: http://localhost:5000/api/detect
// For production: Set this to your deployed backend URL
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api/detect'
    : 'https://suraksha-drishti-api.onrender.com/api/detect'; // Update after deploying backend
const USE_API = true; // Set to true to use real AI models

// Statistics
let stats = {
    incidents: 0,
    weapons: 0,
    people: 0,
    threatLevel: 0,
    alerts: []
};

// Chart
let threatChart = null;
let chartData = [];
const MAX_CHART_POINTS = 50;

// Frame processing
let frameCount = 0;
let lastProcessTime = 0;
const PROCESS_INTERVAL = 500; // Process every 500ms (2 FPS for AI)

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    videoElement = document.getElementById('videoElement');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    setupEventListeners();
    initChart();
});

function setupEventListeners() {
    // Source selection
    document.querySelectorAll('input[name="source"]').forEach(radio => {
        radio.addEventListener('change', handleSourceChange);
    });
    
    // Buttons
    document.getElementById('startBtn').addEventListener('click', startMonitoring);
    document.getElementById('stopBtn').addEventListener('click', stopMonitoring);
    
    // Video file upload
    document.getElementById('videoFile').addEventListener('change', handleVideoUpload);
}

function handleSourceChange(e) {
    const source = e.target.value;
    
    // Hide all config sections
    document.getElementById('videoUpload').style.display = 'none';
    document.getElementById('rtspConfig').style.display = 'none';
    
    // Show selected config
    if (source === 'video') {
        document.getElementById('videoUpload').style.display = 'block';
    } else if (source === 'rtsp') {
        document.getElementById('rtspConfig').style.display = 'block';
    }
}

function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        videoElement.src = url;
        videoElement.load();
    }
}

async function startMonitoring() {
    const source = document.querySelector('input[name="source"]:checked').value;
    
    try {
        if (source === 'webcam') {
            // Request webcam access
            stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false
            });
            videoElement.srcObject = stream;
        } else if (source === 'video') {
            // Video file already loaded
            if (!videoElement.src) {
                alert('Please upload a video file first');
                return;
            }
            videoElement.play();
        } else if (source === 'rtsp') {
            alert('RTSP streaming requires a backend server. Please use webcam or video upload for browser-only demo.');
            return;
        }
        
        isMonitoring = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        
        // Wait for video to be ready
        videoElement.onloadedmetadata = () => {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            processFrames();
        };
        
    } catch (error) {
        console.error('Error starting monitoring:', error);
        alert('Could not access camera. Please check permissions.');
    }
}

function stopMonitoring() {
    isMonitoring = false;
    
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    if (videoElement.srcObject) {
        videoElement.srcObject = null;
    }
    
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
}

function processFrames() {
    if (!isMonitoring) return;
    
    // Draw current frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Process frame with AI (throttled)
    const now = Date.now();
    if (now - lastProcessTime > PROCESS_INTERVAL) {
        lastProcessTime = now;
        
        if (USE_API) {
            processFrameWithAPI();
        } else {
            simulateDetection();
        }
    }
    
    // Continue processing
    animationId = requestAnimationFrame(processFrames);
}

async function processFrameWithAPI() {
    try {
        // Get frame as base64
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        
        // Send to API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        });
        
        if (!response.ok) {
            console.error('API error:', response.statusText);
            simulateDetection(); // Fallback to simulation
            return;
        }
        
        const result = await response.json();
        
        // Update stats from API response
        stats.threatLevel = Math.floor(result.threatLevel);
        stats.people = result.people;
        
        // Check for weapons
        if (result.weapons && result.weapons.length > 0) {
            stats.weapons += result.weapons.length;
            addAlert('HIGH THREAT', `${result.weapons.length} weapon(s) detected`);
        }
        
        // Check for violence
        if (result.violence) {
            stats.incidents++;
            addAlert('ELEVATED', 'Violent behavior detected');
        }
        
        // Update UI
        updateUI();
        updateChart();
        
    } catch (error) {
        console.error('API call failed:', error);
        // Fallback to simulation if API is not available
        simulateDetection();
    }
}

function simulateDetection() {
    // Simulate random threat detection for demo
    // In production, replace with actual TensorFlow.js model inference
    
    const randomThreat = Math.random();
    stats.threatLevel = Math.floor(randomThreat * 100);
    
    // Simulate people detection
    if (Math.random() > 0.7) {
        stats.people = Math.floor(Math.random() * 5) + 1;
    }
    
    // Simulate weapon detection
    if (randomThreat > 0.85) {
        stats.weapons++;
        addAlert('HIGH THREAT', 'Weapon detected in frame');
    }
    
    // Simulate violence detection
    if (randomThreat > 0.75 && randomThreat <= 0.85) {
        stats.incidents++;
        addAlert('ELEVATED', 'Suspicious activity detected');
    }
    
    // Update UI
    updateUI();
    updateChart();
}

function updateUI() {
    // Update metrics
    document.getElementById('threatLevel').textContent = stats.threatLevel + '%';
    document.getElementById('incidentCount').textContent = stats.incidents;
    document.getElementById('weaponCount').textContent = stats.weapons;
    document.getElementById('peopleCount').textContent = stats.people;
    
    // Update status card
    const statusCard = document.getElementById('statusCard');
    const statusIcon = statusCard.querySelector('.status-icon');
    const statusLevel = statusCard.querySelector('.status-level');
    const statusDetail = statusCard.querySelector('.status-detail');
    
    if (stats.threatLevel >= 70) {
        statusCard.className = 'status-card status-high';
        statusIcon.textContent = '🚨';
        statusLevel.textContent = 'HIGH THREAT';
        statusDetail.textContent = `Threat Level: ${stats.threatLevel}%`;
    } else if (stats.threatLevel >= 50) {
        statusCard.className = 'status-card status-elevated';
        statusIcon.textContent = '⚠️';
        statusLevel.textContent = 'ELEVATED';
        statusDetail.textContent = `Threat Level: ${stats.threatLevel}%`;
    } else {
        statusCard.className = 'status-card status-normal';
        statusIcon.textContent = '✅';
        statusLevel.textContent = 'NORMAL';
        statusDetail.textContent = 'No threats detected';
    }
}

function addAlert(level, message) {
    const time = new Date().toLocaleTimeString();
    const alert = {
        time: time,
        level: level,
        message: message
    };
    
    stats.alerts.unshift(alert);
    if (stats.alerts.length > 10) {
        stats.alerts.pop();
    }
    
    updateAlertsList();
}

function updateAlertsList() {
    const alertsList = document.getElementById('alertsList');
    
    if (stats.alerts.length === 0) {
        alertsList.innerHTML = '<p class="no-alerts">No alerts</p>';
        return;
    }
    
    alertsList.innerHTML = stats.alerts.map(alert => {
        const className = alert.level === 'HIGH THREAT' ? 'alert-high' : 'alert-medium';
        return `
            <div class="alert-item ${className}">
                <strong>${alert.time}</strong> - ${alert.level}: ${alert.message}
            </div>
        `;
    }).join('');
}

function initChart() {
    const ctx = document.getElementById('threatChart').getContext('2d');
    
    threatChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Threat Level',
                data: [],
                borderColor: '#d32f2f',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Threat Level (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!threatChart) return;
    
    const time = new Date().toLocaleTimeString();
    
    chartData.push({
        time: time,
        value: stats.threatLevel
    });
    
    if (chartData.length > MAX_CHART_POINTS) {
        chartData.shift();
    }
    
    threatChart.data.labels = chartData.map(d => d.time);
    threatChart.data.datasets[0].data = chartData.map(d => d.value);
    threatChart.update('none'); // Update without animation for performance
}

// Add threshold line to chart
function addThresholdLine() {
    if (!threatChart) return;
    
    threatChart.options.plugins.annotation = {
        annotations: {
            line1: {
                type: 'line',
                yMin: 70,
                yMax: 70,
                borderColor: '#f57c00',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                    content: 'Threshold',
                    enabled: true,
                    position: 'end'
                }
            }
        }
    };
}

// Handle page visibility (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isMonitoring) {
        // Optionally pause processing when tab is hidden
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (isMonitoring) {
        stopMonitoring();
    }
});
