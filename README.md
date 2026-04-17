:

🚀 Zenvest
Parametric Income Protection for Delivery Partners

Zenvest is a web-based micro-insurance platform that delivers instant, trigger-based payouts for India’s gig workforce.

Instead of manual claims, Zenvest uses real-world environmental triggers (weather, AQI, downtime) to automatically compensate delivery partners—ensuring they are protected from factors beyond their control.

✨ Key Highlights
⚡ Instant payouts (no claim process)
📡 Real-time environmental triggers
🤖 AI-driven risk profiling & fraud detection
🌐 Works on any device (no install required)
🧩 Microservices-based scalable architecture
🧭 How the System Works
User signs up and selects a plan
AI recommends optimal coverage
Payment activates the policy
External trigger occurs (rain, AQI, etc.)
💸 Automatic payout within seconds
💻 How to Run the Project
⚠️ Important
The system follows a microservices architecture
Each service runs independently
Tested on:
Same device OR
Same WiFi network

👉 You must run all services together for the system to work correctly.

📥 Step 1: Clone Repository
git clone <your-repo-url>
cd zenvest
📦 Step 2: Install Dependencies

Run inside each service folder:

npm install
⚙️ Step 3: Start Backend Services

Run each backend service:

npm run dev

or

npm start

Ensure each service runs on its designated port (e.g., 8080, 5000)

🌐 Step 4: Start Frontend
cd frontend
npm run dev

Access the app at:

http://localhost:5173
🔗 Step 5: API Configuration
Same device → use localhost
Different devices → use local IP address

Example:

http://192.168.x.x:8080/api/v1/

📡 Step 6: Network Requirement
All services must be on the same WiFi/network
For multi-device testing:
Backend runs on one machine
Frontend accessed via IP on another

🔐 Step 7: Environment Variables

Create .env files where required:

PORT=8080
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
RAZORPAY_KEY=your_key
🚧 Current Status
🧪 Development & testing phase
🔌 Services run locally and independently
🚀 Cloud deployment planned in future releases
🏗️ Architecture Overview
Microservices-based system
Independent services communicating via APIs
Designed for modular scaling and easy deployment
👤 User Scenarios
🛵 Delivery Partner (Veer)
Earns daily income via platforms
Faces income drops during bad conditions

Flow:

Signup → Choose Plan → Pay → Trigger Event → 💸 Instant Payout
📊 Operations Manager
Monitors risk zones
Tracks losses and fraud
Uses predictive insights for decisions
💰 Pricing Model
Plan	Price	Description
🟢 Starter Shield	₹99/week	Basic coverage
🔵 Smart Shield	₹149/week	Balanced plan
🟣 Pro Shield	₹249/week	Maximum coverage
⚡ Trigger-Based Payouts

Payouts are automatically triggered when:

🌧 Rainfall > 25mm
🌫 AQI > 400
📉 Platform downtime > 2 hours
🔥 Temperature > 45°C
🤖 AI & Intelligence Layer
Identity Verification (OCR + Liveness Detection)
Risk Profiling (XGBoost)
Disruption Prediction (LSTM)
Fraud Detection (Isolation Forest)
Plan Recommendation Engine
Chatbot Support (LLM)
Churn Prediction
Sentiment Analysis
🧱 Tech Stack
Layer	Technology
Frontend	React + Tailwind CSS
Backend	Node.js (Express/Fastify)
Database	MongoDB
Cache	Redis
Messaging	AWS SQS
Payments	Razorpay
Infrastructure	AWS
🛡️ Security & Compliance
IRDAI Sandbox aligned
DPDP Act 2023 compliant
AES-256 encryption
TLS 1.3 secure APIs
🧠 Fraud Detection (Sentinel)
Detects GPS spoofing & fake activity
Uses motion + network + behavioral signals
Identifies coordinated fraud clusters
Multi-layer verification system
🚀 Future Roadmap
☁️ Full AWS deployment
📈 Multi-city scaling
📱 Optional mobile app
⚡ Production-grade rollout
📌 Final Note

Zenvest is a scalable, AI-powered parametric insurance platform currently running in a local microservices setup, with full deployment planned in upcoming phases.
