# 🛡️ SafetyVision AI — Industrial Safety Monitoring Platform

---

## 📌 Overview
SafetyVision AI is an AI-native industrial safety monitoring platform that uses computer vision and deep learning to automatically detect:
- PPE compliance violations
- Fire, smoke, sparks, and hazard events
- Unsafe worker behavior
- Zone-level safety risks

The system provides a real-time interactive dashboard that visualizes safety events, alerts supervisors instantly, and generates actionable analytics.
This project demonstrates how AI can proactively prevent workplace accidents rather than reacting after incidents occur.

---

## ❗ Problem Statement
Industrial workplaces face serious safety challenges:
- Manual monitoring is inefficient and error-prone
- PPE compliance is difficult to enforce at scale
- Hazards like fire, smoke, and leaks are detected too late
- CCTV footage is underutilized
- Safety officers cannot monitor multiple zones simultaneously

**Current Limitations**:
- Reactive safety management
- No real-time alerts
- No centralized analytics
- High accident risk
- Lack of automation

---

## ✅ Our Solution
SafetyVision AI solves this by creating an automated AI-powered monitoring pipeline:

-
What We Built:
- Real-time PPE detection using YOLO
- Live hazard detection (fire, smoke, sparks)
- Person tracking and ID association
- Smart violation detection rules
- Live monitoring dashboard
- Analytics and reporting interface
- Multi-camera scalability

How It Works:
CCTV / Video Feed
        ↓
YOLO AI Detection Engine
        ↓
Python Flask Backend API
        ↓
React Dashboard Frontend
        ↓
Live Alerts + Analytics + Visualization

---

## ⭐ Key Features
**👷 PPE Compliance Detection**
- Helmet detection
- Mask detection
- Safety gear tracking
- Real-time violation tagging

**🔥 Hazard Detection**
- Fire detection
- Smoke detection
- Spark detection
- Environmental risk monitoring

**🎥 Live Monitoring Dashboard**
- Bounding box overlays
- Multi-camera support
- Zone-based monitoring
- Status indicators

**🚨 Smart Alerts System**
- Critical risk notifications
- Priority-based alerts
- Visual alert panel
- Event logging

**📊 Advanced Analytics**
- Violation trends
- Hazard timeline
- Compliance rate tracking
- Employee safety performance

**⚙️ Modular Architecture**
- Plug-and-play backend
- API-based integration
- Scalable design

---

## 🧰 Tech Stack
**AI / Backend**
- Python
- YOLOv8 (Ultralytics)
- OpenCV
- Flask
- Flask-CORS

**Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons

---

## ⚙️ How To Run Locally
1️⃣ **Clone Repository**
git clone https://github.com/your-username/safetyvision-ai.git
cd safetyvision-ai

2️⃣**Backend Setup (YOLO Server)**
Go to backend folder:
cd backend

Install dependencies:
pip install ultralytics flask flask-cors opencv-python

Run frontend:
npm i 
npm run dev

Run Backend:
py safetyvision.py

---

## 🌐 Live Prototype

🔗 Frontend Demo:

https://696b2bef0ace9a333454aa78--stunning-cajeta-f1e96b.netlify.app/




---

