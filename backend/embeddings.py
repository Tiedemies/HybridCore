# backend/embeddings.py
import ollama
import chromadb
import yaml
from pathlib import Path
from typing import List, Union, Dict, Any

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

PERSIST_DIR = Path(config["chroma"]["persist_directory"])
PERSIST_DIR.mkdir(parents=True, exist_ok=True)

# One persistent local Chroma store
chroma_client = chromadb.PersistentClient(path=str(PERSIST_DIR))
collection = chroma_client.get_or_create_collection("entries")


def _normalize_embedding(resp: Union[dict, object]) -> List[float]:
    """
    Normalize Ollama embed() responses into a flat 1-D list[float].
    Handles:
      - {"embeddings": [[...]]}  # common for single input
      - {"embeddings": [...]}    # edge case
      - {"embedding": [...]}     # older client
      - resp.embeddings / resp.embedding
    """
    vec = None
    if isinstance(resp, dict):
        if "embeddings" in resp:
            vec = resp["embeddings"]
        elif "embedding" in resp:
            vec = resp["embedding"]
    else:
        if hasattr(resp, "embeddings"):
            vec = getattr(resp, "embeddings")
        elif hasattr(resp, "embedding"):
            vec = getattr(resp, "embedding")

    if vec is None:
        raise KeyError(f"Unexpected response from ollama.embed: {resp}")

    # If we got a 2D list for a single string, take the first row
    if isinstance(vec, (list, tuple)) and vec and isinstance(vec[0], (list, tuple)):
        vec = vec[0]

    if not isinstance(vec, (list, tuple)):
        raise ValueError(f"Embedding not a list/tuple: {type(vec)}")

    return [float(x) for x in vec]


def _flatten_metadata(meta: Dict[str, Any]) -> Dict[str, Any]:
    """
    Chroma metadata must be scalar (str/int/float/bool/None).
    Flatten nested dicts like:
      cascading_effect: {"Tech.Org": 0.4, "Soc.Org": 0.2}
    → cascading_effect__Tech_Org = 0.4, cascading_effect__Soc_Org = 0.2
    """
    flat: Dict[str, Any] = {}
    for k, v in meta.items():
        if isinstance(v, dict):
            for sk, sv in v.items():
                subkey = sk.replace(".", "_")
                flat[f"{k}__{subkey}"] = float(sv) if isinstance(sv, (int, float)) else sv
        else:
            flat[k] = v
    return flat


def embed_text(text: str) -> List[float]:
    model_name = config["embeddings"]["model"]
    resp = ollama.embed(model=model_name, input=text or "")
    return _normalize_embedding(resp)


def add_to_chroma(entry_id: str, text: str, metadata: dict):
    """Add/overwrite a single item in the Chroma collection with Ollama embedding."""
    vector = embed_text(text)                # 1-D list[float]
    safe_meta = _flatten_metadata(metadata)  # scalars only
    collection.add(
        ids=[entry_id],
        embeddings=[vector],                 # wrap once: list-of-vectors
        metadatas=[safe_meta],
        documents=[text or ""],
    )


def search_chroma(query: str, filters: dict = None, top_k: int = 5):
    """
    Search using *Ollama* for the query embedding, not Chroma’s auto-embed.
    This avoids ONNX downloads and keeps one embedding source of truth.
    """
    qvec = embed_text(query or "")
    results = collection.query(
        query_embeddings=[qvec],             # <— not query_texts
        n_results=top_k,
        where=filters or {},
        include=["metadatas", "documents", "distances"],
    )
    return results
