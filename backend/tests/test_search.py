import requests

query = {
    "query": "power outage",
    "filters": {"country": "DE"},
    "top_k": 3
}

resp = requests.post("http://127.0.0.1:8000/search", json=query)
print("Search response:", resp.json())
