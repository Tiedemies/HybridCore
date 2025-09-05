import ollama
import chromadb
import yaml
from pathlib import Path

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

PERSIST_DIR = Path(config["chroma"]["persist_directory"])
PERSIST_DIR.mkdir(parents=True, exist_ok=True)

chroma_client = chromadb.PersistentClient(path=str(PERSIST_DIR))
collection = chroma_client.get_or_create_collection("entries")


def embed_text(text: str):
    model_name = config["embeddings"]["model"]
    response = ollama.embed(model=model_name, input=text)
    return response["embedding"]


def add_to_chroma(entry_id: str, text: str, metadata: dict):
    embedding = embed_text(text)
    collection.add(
        ids=[entry_id],
        embeddings=[embedding],
        metadatas=[metadata],
        documents=[text],
    )


def search_chroma(query: str, filters: dict = None, top_k: int = 5):
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where=filters or {}
    )
    return results
