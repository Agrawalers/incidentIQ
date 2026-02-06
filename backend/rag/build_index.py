import sys
import os
from pathlib import Path

# Add parent directory to path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

import json
import faiss
import numpy as np
from backend.utils.embeddings import get_embedding

# Load incidents
with open("data/incidents.json", "r") as f:
    incidents = json.load(f)

documents = []
metadata = []

for inc in incidents:
    text = f"""
    Service: {inc['service']}
    Error: {inc['error']}
    Root Cause: {inc['root_cause']}
    Resolution: {inc['resolution']}
    """
    documents.append(text)
    metadata.append({
        "id": inc["id"],
        "service": inc["service"],
        "error": inc["error"]
    })

print(f"Loaded {len(documents)} incidents")

# Generate embeddings
vectors = [get_embedding(doc) for doc in documents]
vectors = np.array(vectors).astype("float32")

# Create FAISS index
dimension = vectors.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(vectors)

# Save index
faiss.write_index(index, "rag/index.faiss")

# Save metadata
with open("rag/index_meta.json", "w") as f:
    json.dump(metadata, f, indent=2)

print("✅ FAISS index built successfully")
