# analysis.py
import numpy as np
from PIL import Image
import io
import requests
from tensorflow.keras.applications import MobileNetV2  # type: ignore
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions  # type: ignore
from tensorflow.keras.preprocessing import image  # type: ignore
import matplotlib.pyplot as plt
import csv

model = MobileNetV2(weights='imagenet')

def get_weather(lat, lon, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    response = requests.get(url)
    data = response.json()

    if "main" not in data or "weather" not in data:
        print("⚠️ Weather API error:", data)
        return {
            "temperature": 0,
            "humidity": 0,
            "description": "Unavailable",
            "rain": 0
        }

    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"],
        "rain": data.get("rain", {}).get("1h", 0)
    }

def analyze_image(img_bytes, lat=19.0760, lon=72.8777, api_key="0e027b1eb71c56c57eb08141cdbade9c"):
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB').resize((224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)

    preds = model.predict(x)
    decoded = decode_predictions(preds, top=3)[0]
    land_type = decoded[0][1]
    confidence = float(decoded[0][2])

    img_np = np.array(img)
    green = img_np[:, :, 1].astype(float)
    red = img_np[:, :, 0].astype(float)
    greenness_index = np.mean((green - red) / (green + red + 1e-5))

    try:
        weather = get_weather(lat, lon, api_key)
    except Exception as e:
        print("⚠️ Error fetching weather:", str(e))
        weather = {
            "temperature": 0,
            "humidity": 0,
            "description": "Unavailable",
            "rain": 0
        }

    suggestions, costs = get_suggestions(land_type, greenness_index, weather)
    export_to_csv("report.csv", land_type, greenness_index, weather, suggestions, costs)

    return {
        "land_type": land_type,
        "confidence": confidence,
        "greenness_index": greenness_index,
        "weather": {
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "description": weather["description"],
            "precipitation": weather["rain"]
        },
        "suggestions": suggestions,
        "costs": costs
    }

def get_suggestions(land_type, greenness_index, weather):
    suggestions = []
    costs = []

    if "desert" in land_type or greenness_index < 0.1:
        suggestions.extend(["Drought-resistant plants", "Rainwater harvesting", "Solar panels"])
        costs.extend([("Rainwater Tank", 2500), ("Solar Panels per acre", 500000)])
    elif "forest" in land_type:
        suggestions.extend(["Agroforestry", "Conserve biodiversity"])
        costs.extend([("Agroforestry Setup", 2500)])
    elif "field" in land_type or "farm" in land_type or greenness_index > 0.3:
        suggestions.extend(["Crop rotation", "Drip irrigation", "Organic compost"])
        costs.extend([("Drip Irrigation", 1000), ("Compost", 800)])
    else:
        suggestions.extend(["Solar power setup", "Recharge pit"])
        costs.extend([("Solar Setup", 450000), ("Water Pit", 2000)])
    return suggestions, costs

def export_to_csv(filename, land_type, greenness_index, weather, suggestions, costs):
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Land Type", land_type])
        writer.writerow(["Greenness Index", greenness_index])
        writer.writerow(["Weather", weather])
        writer.writerow([])
        writer.writerow(["Suggestions", "Estimated Cost"])
        for item, cost in zip(suggestions, costs):
            writer.writerow([item, f"₹{cost}"])

