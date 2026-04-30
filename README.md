# 🌦️ Weather App (Flask + PWA)

A modern **Weather Application** built using Python and Flask that allows users to check real-time weather conditions for any city.
The app is enhanced with **Progressive Web App (PWA)** features, making it installable on mobile devices like a native app.

---

## 🚀 Features

* 🌍 Search weather by city name
* 🌡️ Real-time temperature (°C)
* ☁️ Weather condition description
* 💧 Humidity & 🌬 Wind speed
* 📱 Mobile-friendly UI
* 📦 Installable as a PWA (acts like a mobile app)
* ⚡ Fast loading with service worker

---

## 🛠️ Tech Stack

* **Backend:** Python (Flask)
* **Frontend:** HTML, CSS
* **API:** OpenWeather API
* **PWA:** Manifest + Service Worker

---

## 📁 Project Structure

```
weather-app/
│
├── app.py
├── requirements.txt
├── .env
│
├── static/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icon.png
│
└── templates/
    └── index.html
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

---

### 2. Install dependencies

```
pip install -r requirements.txt
```

---

### 3. Setup environment variables

Create a `.env` file in the root folder:

```
OPENWEATHER_API_KEY=your_api_key_here
```

---

### 4. Run the application

```
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## 📱 Convert to Mobile App (APK)

1. Deploy the app online
2. Go to https://www.pwabuilder.com
3. Enter your app URL
4. Click **Build APK**
5. Download and install on your phone

---

## 🌐 Deployment

You can deploy this app using:

* Render
* Vercel
* Railway

---

## 🔐 Environment Variables

| Variable            | Description  |
| ------------------- | ------------ |
| OPENWEATHER_API_KEY | Your API key |

---

## 🧠 Future Improvements

* 📍 Auto location detection (GPS)
* 📅 5-day weather forecast
* 🌙 Dark mode
* 📊 Weather charts
* 🔐 User login system

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork this repo and submit a pull request.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Ruthwik Ch**

* GitHub: https://github.com/your-username

---

## ⭐ If you like this project

Give it a star ⭐ on GitHub!
