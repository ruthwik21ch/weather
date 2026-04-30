from flask import Flask, render_template, request
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load API key from .env file

app = Flask(__name__)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


@app.route("/", methods=["GET", "POST"])
def index():
    weather = None
    error = None

    if request.method == "POST":
        city = request.form.get("city", "").strip()

        # Basic input validation
        if not city:
            error = "Please enter a city name."
        elif len(city) > 100:
            error = "City name is too long."
        elif not API_KEY:
            error = "API key not configured. Please set OPENWEATHER_API_KEY in your .env file."
        else:
            try:
                response = requests.get(
                    BASE_URL,
                    params={
                        "q": city,
                        "appid": API_KEY,
                        "units": "metric"
                    },
                    timeout=5  # Avoid hanging requests
                )

                if response.status_code == 200:
                    data = response.json()
                    weather = {
                        "city":     data["name"],
                        "country":  data["sys"]["country"],
                        "temp":     round(data["main"]["temp"]),
                        "feels_like": round(data["main"]["feels_like"]),
                        "desc":     data["weather"][0]["description"].title(),
                        "humidity": data["main"]["humidity"],
                        "wind":     data["wind"]["speed"],
                        "icon":     data["weather"][0]["icon"]
                    }

                elif response.status_code == 404:
                    error = "City not found. Please check the spelling and try again."

                elif response.status_code == 401:
                    error = "Invalid API key. Please check your configuration."

                else:
                    error = f"Weather service error (code {response.status_code}). Try again later."

            except requests.exceptions.ConnectionError:
                error = "No internet connection. Please check your network."

            except requests.exceptions.Timeout:
                error = "Request timed out. The weather service is slow — try again."

            except requests.exceptions.RequestException:
                error = "Something went wrong. Please try again."

    return render_template("index.html", weather=weather, error=error)


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)
