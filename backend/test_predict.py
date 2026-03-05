import requests
import json

url = "http://localhost:8005/predict"

data = {
    "role": "Frontend Developer",
    "years_experience": 2,
    "skills": "React, JavaScript, Node.js, MongoDB, AWS, Docker",
    "proficiency": {
        "React": "Advanced",
        "JavaScript": "Advanced",
        "Node.js": "Intermediate",
        "MongoDB": "Intermediate",
        "AWS": "Beginner",
        "Docker": "Beginner"
    }
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error:", response.text)
except Exception as e:
    print("Request failed:", e)
