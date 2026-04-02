#!/usr/bin/env python3
"""
PartSeek Ingest - rev08.001 20:27 branch main_sia09
Basic Metadata Extraction (Option C)

Extracts:
- thread (M6, M8, M10, etc.)
- material (Steel, Stainless Steel, Plastic)
- part_type (screw, bolt, nut, washer)
- surface_color (Black, Silver, Blank)
- length (mm)

Version: rev08.001
Date: 31.03.2026
"""

import re
from pathlib import Path
from typing import Dict, Optional
import pdfplumber
import chromadb
from chromadb.utils.embedding_functions import OllamaEmbeddingFunction

# ─────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────

BASE_PATH = Path(__file__).resolve().parents[3]
DATA_PATH = BASE_PATH / "05_data" / "01_Fasteners"
CHROMA_PATH = BASE_PATH / "chroma_db"
COLLECTION_NAME = "knowseek"

# Embedding Model — same as DocSeek (768D, nomic-embed-text via Ollama)
EMBED_FN = OllamaEmbeddingFunction(
    model_name="nomic-embed-text",
    url="http://localhost:11434/api/embeddings",
)


# ─────────────────────────────────────────────────────
# METADATA EXTRACTION (BASIC - Option C)
# ─────────────────────────────────────────────────────

def extract_thread(text: str) -> Optional[str]:
    """Extract thread size: M6, M8, M10, M12, M14, M16"""
    # Pattern: M followed by digits (optionally with × or x)
    match = re.search(r'M(\d+)(?:\s*[×xX]\s*)?', text)
    if match:
        return f"M{match.group(1)}"
    return None


def extract_length(text: str) -> Optional[str]:
    """Extract length in mm"""
    # Pattern: M10 × 30 or M10 x 30
    match = re.search(r'M\d+\s*[×xX]\s*(\d+(?:\.\d+)?)', text)
    if match:
        return match.group(1)
    
    # Pattern: Length: 30 mm or L: 30
    match = re.search(r'(?:Length|Länge|L)[:\s]+(\d+(?:\.\d+)?)\s*(?:mm)?', text, re.IGNORECASE)
    if match:
        return match.group(1)
    
    return None


def extract_material(text: str) -> Optional[str]:
    """Extract material type"""
    text_lower = text.lower()
    
    # Stainless Steel (check first - more specific)
    if any(x in text_lower for x in ['stainless', 'edelstahl', 'a2', 'a4', 'x5crni']):
        return "Stainless Steel"
    
    # Steel
    if any(x in text_lower for x in ['steel', 'stahl', 'st37', 'st52']):
        return "Steel"
    
    # Plastic
    if any(x in text_lower for x in ['plastic', 'kunststoff', 'pa', 'pom', 'nylon']):
        return "Plastic"
    
    # Aluminum
    if any(x in text_lower for x in ['aluminum', 'aluminium', 'al']):
        return "Aluminum"
    
    return None


def extract_part_type(text: str) -> Optional[str]:
    """Extract part type"""
    text_lower = text.lower()
    
    # Check for specific types first (more specific to less specific)
    if 'flange' in text_lower and ('screw' in text_lower or 'bolt' in text_lower):
        return "flange_screw"
    
    if 'weld' in text_lower and ('nut' in text_lower or 'mutter' in text_lower):
        return "weld_nut"
    
    if 'rivet' in text_lower and ('nut' in text_lower or 'mutter' in text_lower):
        return "rivet_nut"
    
    if 'pierce' in text_lower and ('nut' in text_lower or 'mutter' in text_lower):
        return "pierce_nut"
    
    # Generic types
    if 'bolt' in text_lower:
        return "bolt"
    
    if 'screw' in text_lower or 'schraube' in text_lower:
        return "screw"
    
    if 'nut' in text_lower or 'mutter' in text_lower:
        return "nut"
    
    if 'washer' in text_lower or 'scheibe' in text_lower:
        return "washer"
    
    if 'rivet' in text_lower or 'niet' in text_lower:
        return "rivet"
    
    return None


def extract_surface_color(text: str) -> Optional[str]:
    """Extract surface color"""
    text_lower = text.lower()
    
    # Check for color keywords
    if 'black' in text_lower or 'schwarz' in text_lower:
        return "Black"
    
    if 'silver' in text_lower or 'silber' in text_lower:
        return "Silver"
    
    if 'blank' in text_lower or 'bright' in text_lower:
        return "Blank"
    
    if 'zinc' in text_lower or 'zink' in text_lower:
        return "Zinc"
    
    if 'natural' in text_lower or 'natur' in text_lower:
        return "Natural"
    
    return None


def extract_drawing_id(filename: str) -> Optional[str]:
    """Extract drawing ID from filename"""
    # Pattern: 6-7 digits
    match = re.search(r'(\d{6,7})', filename)
    if match:
        return match.group(1)
    return None


def extract_oem(filename: str, text: str) -> Optional[str]:
    """Extract OEM from filename or text"""
    filename_lower = filename.lower()
    text_lower = text.lower()
    
    # Check filename first
    if 'volvo' in filename_lower:
        return "Volvo"
    if 'gm' in filename_lower or 'general motors' in filename_lower:
        return "GM"
    if 'din' in filename_lower:
        return "DIN"
    if 'vw' in filename_lower or 'volkswagen' in filename_lower:
        return "VW"
    if 'bmw' in filename_lower:
        return "BMW"
    if 'mercedes' in filename_lower or 'daimler' in filename_lower:
        return "Mercedes"
    
    # Check text
    if 'volvo' in text_lower:
        return "Volvo"
    if 'general motors' in text_lower or 'gmw' in text_lower:
        return "GM"
    
    return None


def extract_metadata(text: str, filename: str) -> Dict:
    """
    Extract basic metadata from text and filename
    
    Returns structured metadata dict with:
    - thread, length, material, part_type, surface_color
    - All set to None if not found (honest N/A)
    """
    metadata = {
        # Extracted fields
        "thread": extract_thread(text),
        "length": extract_length(text),
        "material": extract_material(text),
        "part_type": extract_part_type(text),
        "surface_color": extract_surface_color(text),
        
        # From filename
        "drawing_id": extract_drawing_id(filename),
        "oem": extract_oem(filename, text),
        
        # Placeholders for future (Phase 2)
        "dk": None,  # head_diameter - requires table extraction
        "k": None,   # head_height - requires table extraction
        "fa_max": None,  # max axial force - requires table extraction
        "fr_max": None,  # max radial force - requires table extraction
        "strength": None,  # 8.8, 10.9 - requires careful extraction
    }
    
    return {k: (v if v is not None else "N/A") for k, v in metadata.items()}


# ─────────────────────────────────────────────────────
# PDF PROCESSING
# ─────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks"""
    if not text or len(text) < chunk_size:
        return [text] if text else []
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        
        # Try to break at sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            last_newline = chunk.rfind('\n')
            break_point = max(last_period, last_newline)
            
            if break_point > chunk_size * 0.5:  # At least 50% through
                chunk = chunk[:break_point + 1]
                end = start + break_point + 1
        
        chunks.append(chunk.strip())
        start = end - overlap
    
    return chunks


def process_pdf(pdf_path: Path) -> list:
    """
    Process PDF and return list of (text, metadata) tuples
    """
    print(f"  Processing: {pdf_path.name}")
    
    results = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page_num, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                
                if not text or len(text.strip()) < 50:
                    continue
                
                # Extract metadata from FULL page text
                # (Better context for extraction)
                extracted_meta = extract_metadata(text, pdf_path.name)
                
                # Chunk the text
                chunks = chunk_text(text)
                
                for chunk_idx, chunk in enumerate(chunks):
                    # Base metadata
                    metadata = {
                        "filename": pdf_path.name,
                        "page": page_num,
                        "chunk": chunk_idx,
                        "module": "partseek",
                        "category": "Supplier-Fastener",  # Default
                    }
                    
                    # Add extracted metadata
                    metadata.update(extracted_meta)
                    
                    # Adjust category based on OEM
                    if metadata.get("oem") in ["Volvo", "GM", "VW", "BMW", "Mercedes"]:
                        metadata["category"] = "OEM-Fastener"
                    elif metadata.get("oem") == "DIN":
                        metadata["category"] = "Standard-Fastener"
                    
                    results.append((chunk, metadata))
    
    except Exception as e:
        print(f"    ⚠️  Error: {e}")
    
    return results


# ─────────────────────────────────────────────────────
# CHROMADB INGEST
# ─────────────────────────────────────────────────────

def ingest_to_chromadb(data: list):
    """Ingest processed data into ChromaDB"""
    
    print("\n📦 Ingesting to ChromaDB...")
    
    # Initialize ChromaDB
    client = chromadb.PersistentClient(path=str(CHROMA_PATH))

    # Get or create collection — use same embedding function as DocSeek
    try:
        collection = client.get_collection(COLLECTION_NAME, embedding_function=EMBED_FN)
        print(f"  Using existing collection: {COLLECTION_NAME}")
    except Exception:
        collection = client.create_collection(COLLECTION_NAME, embedding_function=EMBED_FN)
        print(f"  Created new collection: {COLLECTION_NAME}")

    # Delete existing partseek chunks so we can re-add cleanly
    existing = collection.get(where={"module": "partseek"})
    if existing["ids"]:
        collection.delete(ids=existing["ids"])
        print(f"  Removed {len(existing['ids'])} old partseek chunks")

    # Prepare batches
    batch_size = 50
    total = len(data)

    for i in range(0, total, batch_size):
        batch = data[i:i + batch_size]

        texts     = [item[0] for item in batch]
        metadatas = [item[1] for item in batch]
        ids       = [f"partseek_{i + j:06d}" for j in range(len(batch))]

        collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas
        )

        print(f"  Ingested {i + len(batch)}/{total} chunks", end='\r')

    print(f"\n  ✅ Ingested {total} chunks")

    return collection


# ─────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("PartSeek Ingest - rev07_001 (Basic Metadata)")
    print("=" * 60)
    print()
    
    # Check data directory
    if not DATA_PATH.exists():
        print(f"❌ ERROR: Data directory not found!")
        print(f"   Expected: {DATA_PATH}")
        return
    
    # Get all PDFs
    pdfs = sorted(DATA_PATH.glob("*.pdf"))
    
    if not pdfs:
        print(f"❌ ERROR: No PDFs found in {DATA_PATH}")
        return
    
    print(f"Found {len(pdfs)} PDFs\n")
    
    # Process all PDFs
    all_data = []
    
    for pdf_path in pdfs:
        results = process_pdf(pdf_path)
        all_data.extend(results)
    
    print(f"\n📊 Total chunks: {len(all_data)}")
    
    # Show sample metadata
    if all_data:
        print("\n📋 Sample metadata:")
        sample = all_data[0][1]
        for key, value in sample.items():
            if value is not None:
                print(f"  {key}: {value}")
    
    # Ingest to ChromaDB
    collection = ingest_to_chromadb(all_data)
    
    # Summary
    print("\n" + "=" * 60)
    print("✅ INGEST COMPLETE!")
    print("=" * 60)
    print(f"Collection: {COLLECTION_NAME}")
    print(f"Total chunks: {collection.count()}")
    print()
    print("Next steps:")
    print("  1. Test extraction: python3 test_extraction.py")
    print("  2. Start backend: cd 01_backend && python3 main.py")
    print("  3. Test query: curl http://localhost:8001/api/partseek/query \\")
    print("                      -d '{\"question\": \"M10 screw\"}'")
    print()


def run_partseek_ingest(partseek_profile: str = "partseek_100") -> dict:
    """
    Wrapper called from EDA notebook.
    Runs the full ingest and returns a summary dict.
    """
    if not DATA_PATH.exists():
        return {"error": f"Data directory not found: {DATA_PATH}"}

    pdfs = sorted(DATA_PATH.glob("*.pdf"))
    all_data = []
    for pdf_path in pdfs:
        all_data.extend(process_pdf(pdf_path))

    collection = ingest_to_chromadb(all_data)

    profile_counts: dict = {}
    for _, meta in all_data:
        p = meta.get("chunk_config", "unknown")
        profile_counts[p] = profile_counts.get(p, 0) + 1

    return {
        "partseek_profile":    partseek_profile,
        "partseek_chunks":     len(all_data),
        "total_chunks":        collection.count(),
        "total_docs":          len(pdfs),
        "chunk_profile_counts": profile_counts,
    }


if __name__ == "__main__":
    main()
