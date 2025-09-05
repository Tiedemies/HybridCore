from fastapi import FastAPI
from uuid import uuid4
from datetime import datetime
import db
from models import EntryIn, EntryOut, SearchQuery
from embeddings import add_to_chroma, search_chroma

app = FastAPI()

# Initialize SQLite
db.init_db()


@app.post("/ingest", response_model=EntryOut)
def ingest_entry(entry: EntryIn):
    entry_id = str(uuid4())
    entry_dict = entry.dict()
    entry_dict["id"] = entry_id
    entry_dict["timestamp"] = entry.timestamp.isoformat()

    # Insert into SQLite
    db.insert_entry(entry_dict)

    # Insert into Chroma
    add_to_chroma(entry_id, entry.description, metadata=entry_dict)

    return EntryOut(id=entry_id, **entry.dict())


@app.get("/entry/{entry_id}")
def get_entry(entry_id: str):
    row = db.get_entry(entry_id)
    if not row:
        return {"error": "Not found"}
    keys = ["id", "title", "description", "timestamp", "region", "country",
            "subregion", "domain", "space", "layer", "cascading_effect"]
    return dict(zip(keys, row))


@app.post("/search")
def search_entries(query: SearchQuery):
    results = search_chroma(query.query or "", filters=query.filters, top_k=query.top_k)
    return results
