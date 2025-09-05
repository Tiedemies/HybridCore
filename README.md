# CORE Prototype (Backend + Frontend)

This repository contains a prototype tool for working with **event data** using:
- **Backend**: FastAPI + SQLite (relational) + ChromaDB (vector) + Ollama embeddings
- **Frontend**: React + Vite for search, selection, and visualization (Core Board)

It is designed as a lightweight, drop-in prototype that you can run locally on macOS (or Linux) without heavy external dependencies.

---

## ⚙️ Requirements

- **Python 3.9+**
- **Node.js 18+**
- **Ollama** installed locally (for embeddings)

---

## 🚀 Setup

Clone the repository and run:

```bash
./setup.sh
````
This will:

* Create a Python virtual environment and install backend dependencies.
* Install frontend Node.js dependencies.

---

## ▶️ Running the Prototype

To start both backend and frontend together:

```bash
./run.sh
```

* **Backend** → [http://127.0.0.1:8000](http://127.0.0.1:8000)

  * Interactive API docs at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Frontend** → [http://127.0.0.1:5173](http://127.0.0.1:5173)

The backend provides ingestion, vector search, and relational queries.
The frontend lets you search, select entries, and visualize them in a **3×3 Core Strategic Design Board**.

---

## 🧪 Integration Testing

You can validate the whole backend pipeline (SQLite + embeddings + ChromaDB search) with:

```bash
./integration_test.sh
```

This will:

1. Start the backend temporarily.
2. Ingest two sample events from `tests/sample_data.json`.
3. Perform a semantic search (example: `"power outage"` with filter `country=DE`).
4. Print ingestion responses and search results to the terminal.

If you see JSON objects returned for ingestion and search hits with IDs and metadata, the system is working.

---

## 📂 Project Structure

```
backend/                 # FastAPI + SQLite + ChromaDB backend
  ├── main.py            # API entrypoint
  ├── db.py              # SQLite database logic
  ├── embeddings.py      # Ollama + ChromaDB helpers
  ├── models.py          # Pydantic request/response models
  ├── config.yaml        # Config (db path, embedding model, chroma path)
  ├── requirements.txt   # Backend dependencies
  └── tests/             # Simple validation scripts
      ├── sample_data.json
      ├── test_ingest.py
      └── test_search.py

frontend/                # React + Vite frontend
  ├── index.html
  ├── package.json
  ├── vite.config.js
  └── src/
      ├── App.jsx
      └── components/
          ├── SearchBar.jsx
          ├── ResultsList.jsx
          ├── SelectionTray.jsx
          └── CoreBoard.jsx

setup.sh                 # Install Python + Node dependencies
run.sh                   # Start backend + frontend together
integration_test.sh      # Validate ingestion + search
```

---

## 📌 Notes

* The backend uses **SQLite** for relational data and **ChromaDB** for vector similarity search.
* Embeddings are generated with the **local Ollama Python library** (configured via `config.yaml`).
* Frontend queries backend at `http://127.0.0.1:8000`.
* Everything runs locally — no external DB or API services required.

---

## 🗒️ Next Steps

* Add advanced graph algorithms and statistical analysis to the backend.
* Enhance frontend visualization of the **Core Strategic Design Board** with dynamic edges for cascading effects.
* Integrate additional data sources (e.g., GDELT, RSS, manual entry).
* Implement user management and annotation tools for analysts.

```
