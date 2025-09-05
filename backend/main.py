# backend/main.py
from fastapi import FastAPI, HTTPException
from uuid import uuid4
import db
from models import EntryIn, EntryOut, SearchQuery
from embeddings import add_to_chroma, search_chroma, collection

app = FastAPI(title="CORE Prototype (Ollama + Chroma)")

# Initialize SQLite
db.init_db()

@app.get("/health")
def health():
    try:
        _count = collection.count()  # quick touch
        return {"status": "ok", "chroma_count": _count}
    except Exception as e:
        return {"status": "degraded", "error": str(e)}

@app.post("/ingest", response_model=EntryOut)
def ingest_entry(entry: EntryIn):
    entry_id = str(uuid4())
    entry_dict = entry.dict()
    entry_dict["id"] = entry_id
    entry_dict["timestamp"] = entry.timestamp.isoformat()

    try:
        db.insert_entry(entry_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQLite insert failed: {e}")

    try:
        add_to_chroma(entry_id, entry.description, metadata=entry_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chroma/embedding failed: {e}")

    return EntryOut(id=entry_id, **entry.dict())

@app.get("/entry/{entry_id}")
def get_entry(entry_id: str):
    row = db.get_entry(entry_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return row

@app.post("/search")
def search_entries(query: SearchQuery):
    try:
        results = search_chroma(query.query or "", filters=query.filters, top_k=query.top_k)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chroma query failed: {e}")
