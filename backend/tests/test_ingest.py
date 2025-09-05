import requests
import json

with open("tests/sample_data.json") as f:
    entries = json.load(f)

for e in entries:
    resp = requests.post("http://127.0.0.1:8000/ingest", json=e)
    print("Ingest response:", resp.json())
