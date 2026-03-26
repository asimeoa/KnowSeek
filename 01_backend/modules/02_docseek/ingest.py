
"""
ingest.py — KnowSeek.Ai — DocSeek Module
─────────────────────────────────────────
Loads PDF files, splits them into chunks,
adds metadata, and stores everything in ChromaDB.

Version: rev06_001 — 25.03.2026 00:15
Branch:  main_sia07

Chapters:
    1. Imports
    2. Config
    3. Mapping
    4. Helper Functions
        4.1 get_oem_code()
        4.2 get_category()
        4.3 get_module()
        4.4 get_doc_type()
        4.5 get_chunk_config()
        4.6 make_source_id()
        4.7 get_language()
    5. Main Functions
        5.1 extract_text_from_pdf()
        5.2 chunk_pages()
        5.3 build_metadata()
        5.4 load_and_chunk()
        5.5 store_in_chromadb()
        5.6 run_ingest()
    6. Run
"""

# ─────────────────────────────────────────────────────
# 1. IMPORTS
# ─────────────────────────────────────────────────────

import time
import hashlib
from pathlib import Path

import pdfplumber
import chromadb
from langchain_text_splitters import RecursiveCharacterTextSplitter
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction


# ─────────────────────────────────────────────────────
# 2. CONFIG
# ─────────────────────────────────────────────────────

CHUNK_CONFIGS = {
    "small":  {"chunk_size": 400,  "chunk_overlap": 50},   # Experiment 1
    "medium": {"chunk_size": 500,  "chunk_overlap": 100},  # Experiment 2 — Default
    "large":  {"chunk_size": 1000, "chunk_overlap": 200},  # Experiment 3
}

DEFAULT_CONFIG    = "medium"
COLLECTION_NAME   = "knowseek"   # ONE collection for all modules

# Auto-detect paths — works from anywhere
BASE_PATH = Path(__file__).resolve().parents[3]
DB_PATH   = str(BASE_PATH / "chroma_db")
DATA_PATH = BASE_PATH / "05_data"


# ─────────────────────────────────────────────────────
# 3. MAPPING
# ─────────────────────────────────────────────────────

OEM_MAP = {
    "GEORGE": "OEM-G",   # Mercedes-Benz — US Presidents theme
    "MICKEY": "OEM-M",   # GM            — Disney theme
    "ZEUS":   "OEM-Z",   # Volvo         — Greek Gods theme
    "HADES":  "OEM-H",   # Volvo         — Greek Gods theme
    "SWIFT":  "OEM-S",   # China/Internal — Musicians theme
    "MBN":    "OEM-B",   # Mercedes-Benz Norm
}

CATEGORY_MAP = {
    # OEM Fastener Norms — standards from OEMs
    "mbn":       "OEM-Fastener",
    "din":       "OEM-Fastener",
    "iso":       "OEM-Fastener",

    # Supplier Fastener Datasheets — parts from suppliers
    "screw":     "Supplier-Fastener",
    "bolt":      "Supplier-Fastener",
    "nut":       "Supplier-Fastener",
    "washer":    "Supplier-Fastener",
    "torx":      "Supplier-Fastener",
    "hex":       "Supplier-Fastener",
    "flange":    "Supplier-Fastener",
    "rivet":     "Supplier-Fastener",

    # Brackets — holders, clips, angles
    "bracket":   "Bracket",
    "winkel":    "Bracket",
    "clip":      "Bracket",
    "clamp":     "Bracket",
    "halter":    "Bracket",

    # Corrosion — OEM specs and test standards
    "corrosion": "Corrosion",
    "aging":     "Corrosion",
    "ktl":       "Corrosion",
    "crash":     "Corrosion",

    # Painting — coating and surface treatment
    "paint":     "Painting",
    "coating":   "Painting",
    "e-coat":    "Painting",
    "zink":      "Painting",
}

# Categories that belong to PartSeek module
PART_CATEGORIES = [
    "OEM-Fastener",
    "Supplier-Fastener",
    "Bracket",
]


# ─────────────────────────────────────────────────────
# 4. HELPER FUNCTIONS
# ─────────────────────────────────────────────────────

# 4.1 get_oem_code
def get_oem_code(filename: str) -> str:
    """Detect OEM code from filename."""
    filename_upper = filename.upper()
    for key, code in OEM_MAP.items():
        if key in filename_upper:
            return code
    return "OEM-UNKNOWN"


# 4.2 get_category
def get_category(filename: str) -> str:
    """Detect document category from filename."""
    filename_lower = filename.lower()
    for key, category in CATEGORY_MAP.items():
        if key in filename_lower:
            return category
    return "General"


# 4.3 get_module
def get_module(category: str) -> str:
    """
    Assign module based on category.
    PartSeek categories → module="partseek"
    All others         → module="docseek"
    """
    return "partseek" if category in PART_CATEGORIES else "docseek"


# 4.4 get_doc_type
def get_doc_type(pages: int) -> str:
    """Detect document type based on page count."""
    if pages <= 2:
        return "1-Pager"
    elif pages <= 20:
        return "Datasheet"
    elif pages <= 100:
        return "Standard"
    else:
        return "Lastenheft"


# 4.5 get_chunk_config
def get_chunk_config(pages: int) -> dict:
    """Select chunk config based on document size."""
    if pages <= 2:
        return CHUNK_CONFIGS["small"]
    elif pages <= 50:
        return CHUNK_CONFIGS["medium"]
    else:
        return CHUNK_CONFIGS["large"]


# 4.6 make_source_id
def make_source_id(filename: str, page: int, chunk_index: int) -> str:
    """Create a unique source ID for each chunk."""
    raw = f"{filename}_{page}_{chunk_index}"
    return "#" + hashlib.md5(raw.encode()).hexdigest()[:6].upper()


# 4.7 get_language
def get_language(text: str) -> str:
    """
    Detect language from text.
    Simple heuristic — checks for German keywords.
    """
    german_keywords = [
        "und", "der", "die", "das", "ist", "mit", "für",
        "von", "nicht", "auch", "auf", "dem", "ein", "eine"
    ]
    words = text.lower().split()
    german_count = sum(1 for w in words if w in german_keywords)
    ratio = german_count / len(words) if words else 0
    return "DE" if ratio > 0.05 else "EN"


# ─────────────────────────────────────────────────────
# 5. MAIN FUNCTIONS
# ─────────────────────────────────────────────────────

# 5.1 extract_text_from_pdf
def extract_text_from_pdf(pdf_path: Path) -> list[dict]:
    """
    Open a PDF and extract text page by page.
    Returns a list of dicts with page number and text.
    """
    pages = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text and text.strip():
                    pages.append({
                        "page": i + 1,
                        "text": text.strip()
                    })
    except Exception as e:
        print(f"  ERROR reading {pdf_path.name}: {e}")
    return pages


# 5.2 chunk_pages
def chunk_pages(pages: list[dict], config: dict) -> list[dict]:
    """
    Split extracted page text into chunks.
    Keeps page number with each chunk.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=config["chunk_size"],
        chunk_overlap=config["chunk_overlap"],
        separators=["\n\n", "\n", ".", " "]
    )

    chunks = []
    for page_data in pages:
        splits = splitter.split_text(page_data["text"])
        for i, split in enumerate(splits):
            chunks.append({
                "text":        split,
                "page":        page_data["page"],
                "chunk_index": i
            })
    return chunks


# 5.3 build_metadata
def build_metadata(filename: str, page: int, chunk_index: int,
                   total_pages: int, config_name: str, text: str = "") -> dict:
    """
    Build the metadata dict for a single chunk.
    Anti-hallucination schema — RnD_DESCRIPTION.md Section 12.
    """
    category = get_category(filename)
    return {
        "source_id":    make_source_id(filename, page, chunk_index),
        "filename":     filename,
        "page":         page,
        "chunk_index":  chunk_index,
        "oem_code":     get_oem_code(filename),
        "category":     category,
        "module":       get_module(category),
        "doc_type":     get_doc_type(total_pages),
        "language":     get_language(text),
        "verified":     True,
        "chunk_config": config_name,
    }


# 5.4 load_and_chunk
def load_and_chunk(
    data_path: Path = DATA_PATH,
    config_name: str = DEFAULT_CONFIG,
    verbose: bool = True
) -> tuple[list[dict], list[dict]]:
    """
    Load all PDFs from data_path and split into chunks.
    Returns tuple: (chunks, skipped)

    Usage:
        chunks, skipped = load_and_chunk()
        chunks, skipped = load_and_chunk(config_name="large")
    """
    config     = CHUNK_CONFIGS[config_name]
    all_chunks = []
    skipped    = []
    pdf_files  = list(data_path.rglob("*.pdf"))

    if verbose:
        print(f"Config:     {config_name} — chunk={config['chunk_size']} overlap={config['chunk_overlap']}")
        print(f"PDFs found: {len(pdf_files)}")
        print()

    for pdf_path in pdf_files:
        if verbose:
            print(f"  Loading: {pdf_path.name}")

        pages = extract_text_from_pdf(pdf_path)
        if not pages:
            if verbose:
                print(f"    SKIP — no text extracted")
            continue

        total_pages = len(pages)
        chunks      = chunk_pages(pages, config)

        for chunk in chunks:
            metadata = build_metadata(
                filename=pdf_path.name,
                page=chunk["page"],
                chunk_index=chunk["chunk_index"],
                total_pages=total_pages,
                config_name=config_name,
                text=chunk["text"]
            )
            all_chunks.append({
                "text":     chunk["text"],
                "metadata": metadata
            })

        if verbose:
            print(f"    Pages: {total_pages} — Chunks: {len(chunks)}")

    # Find all unsupported files
    supported = [".pdf", ".docx", ".xlsx", ".png", ".webp", ".jpg"]
    for f in data_path.rglob("*"):
        if f.is_file() and not f.name.startswith(".") and f.suffix != "" and f.suffix.lower() not in supported:
            skipped.append({
                "folder": f.parent.name,
                "type":   f.suffix.lower()
            })

    if verbose:
        print()
        print(f"Total chunks: {len(all_chunks)}")

    return all_chunks, skipped


# 5.5 store_in_chromadb
def store_in_chromadb(
    chunks: list[dict],
    collection_name: str = COLLECTION_NAME,
    db_path: str = DB_PATH,
    verbose: bool = True
) -> chromadb.Collection:
    """
    Store all chunks in ChromaDB.

    Usage:
        chunks, _ = load_and_chunk()
        collection = store_in_chromadb(chunks)
    """
    Path(db_path).mkdir(exist_ok=True)
    client = chromadb.PersistentClient(path=db_path)

    try:
        client.delete_collection(collection_name)
        if verbose:
            print(f"Collection '{collection_name}' deleted — starting fresh")
    except Exception:
        pass

    ollama_ef = OllamaEmbeddingFunction(
        url="http://localhost:11434/api/embeddings",
        model_name="nomic-embed-text"
    )

    collection = client.create_collection(
        name=collection_name,
        embedding_function=ollama_ef,
        metadata={"hnsw:space": "cosine"}
    )

    batch_size = 100
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        collection.add(
            documents=[c["text"] for c in batch],
            metadatas=[c["metadata"] for c in batch],
            ids=[c["metadata"]["source_id"] for c in batch]
        )

    if verbose:
        print(f"Stored {len(chunks)} chunks in collection '{collection_name}'")

    return collection


# 5.6 run_ingest
def run_ingest(
    data_path: Path = DATA_PATH,
    config_name: str = DEFAULT_CONFIG,
    collection_name: str = COLLECTION_NAME
) -> dict:
    """
    Full ingest pipeline — load, chunk, store.
    Returns summary dict for MLFlow logging.

    Usage:
        summary = run_ingest()
        summary = run_ingest(config_name="large")
    """
    start = time.time()
    chunks, skipped = load_and_chunk(
        data_path=data_path,
        config_name=config_name,
        verbose=False
    )
    store_in_chromadb(
        chunks,
        collection_name=collection_name,
        verbose=False
    )
    elapsed = round(time.time() - start, 2)
    config  = CHUNK_CONFIGS[config_name]

    # Count by module
    docseek_count  = sum(1 for c in chunks if c["metadata"].get("module") == "docseek")
    partseek_count = sum(1 for c in chunks if c["metadata"].get("module") == "partseek")

    summary = {
        "config_name":    config_name,
        "chunk_size":     config["chunk_size"],
        "chunk_overlap":  config["chunk_overlap"],
        "total_chunks":   len(chunks),
        "docseek_chunks": docseek_count,
        "partseek_chunks": partseek_count,
        "total_docs":     len(set(c["metadata"]["filename"] for c in chunks)),
        "ingest_time_s":  elapsed,
        "collection":     collection_name
    }

    print()
    print("─── Ingest Summary ───────────────────")
    for k, v in summary.items():
        print(f"  {k:<22} {v}")
    print("──────────────────────────────────────")

    if skipped:
        from collections import Counter
        skip_count = Counter(f"{s['folder']}|{s['type']}" for s in skipped)
        print()
        print("─── Skipped files ────────────────────")
        for key, count in skip_count.items():
            folder, ftype = key.split("|")
            print(f"  {folder:<20} {count} file(s)   {ftype}   ⚠️ not supported")
    else:
        print()
        print("✅  All file types supported")

    return summary


# ─────────────────────────────────────────────────────
# 6. RUN
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    summary = run_ingest()