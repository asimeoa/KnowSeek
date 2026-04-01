"""
track_engine.py — KnowSeek.Ai — Track Engine
────────────────────────────────────────────
Converts free-text query into structured track state and ChromaDB where filter.

Version: rev08_001 — 30.03.2026
Branch:  main_sia09
"""

from __future__ import annotations

import re
from typing import Any

THREAD_PATTERN = r"\bM\d+\b"
STRENGTH_PATTERN = r"\b(?:4\.8|6\.8|8\.8|10\.9|12\.9)\b"

DRIVE_TYPES = {
    "torx": "Torx",
    "hex": "Hex",
    "innensechskant": "Hex",
    "xzn": "XZN",
    "phillips": "Phillips",
}

COATINGS = {
    "zinc": "zinc",
    "zink": "zinc",
    "verzinkt": "zinc",
    "ktl": "ktl",
    "geomet": "geomet",
    "blank": "blank",
}

DOCSEEK_TOPICS = {
    "corrosion": "Corrosion",
    "salt spray": "Corrosion",
    "korrosion": "Corrosion",
    "painting": "Painting",
    "coating": "Painting",
    "lack": "Painting",
    "paint": "Painting",
}

OEM_PATTERN = r"\bOEM-[A-Z]\b"

INTENT_KEYWORDS = {
    "requirement": ["requirement", "anforderung", "must", "soll", "shall"],
    "comparison": ["compare", "comparison", "vergleich", "gegenuber", "vs"],
    "standard": ["standard", "norm", "din", "iso", "mbn", "vda"],
}

# Only these keys are safe as ChromaDB metadata filters today.
METADATA_FILTER_KEYS = {"module", "oem_code", "category", "doc_type", "language"}


def detect_module(query: str) -> str:
    q = query.lower()
    if re.search(THREAD_PATTERN, query.upper()):
        return "partseek"
    if any(k in q for k in ["torx", "hex", "xzn", "screw", "bolt", "nut", "flange", "schraube"]):
        return "partseek"
    return "docseek"


def _detect_oem(query: str) -> str | None:
    match = re.search(OEM_PATTERN, query.upper())
    return match.group(0) if match else None


def _detect_docseek_topic(query_lower: str) -> str | None:
    for key, value in DOCSEEK_TOPICS.items():
        if key in query_lower:
            return value
    return None


def _detect_docseek_intent(query_lower: str) -> str | None:
    for intent, keys in INTENT_KEYWORDS.items():
        if any(k in query_lower for k in keys):
            return intent
    return None


def analyze_query(query: str) -> dict[str, Any]:
    query_lower = (query or "").lower()

    result: dict[str, Any] = {
        "module": detect_module(query or ""),
        "filters": {},
        "missing": [],
    }

    if result["module"] == "partseek":
        thread_match = re.search(THREAD_PATTERN, query.upper())
        if thread_match:
            result["filters"]["thread"] = thread_match.group(0)
        else:
            result["missing"].append("thread")

        strength_match = re.search(STRENGTH_PATTERN, query)
        if strength_match:
            result["filters"]["strength"] = strength_match.group(0)
        else:
            result["missing"].append("strength")

        for drive_key, drive_label in DRIVE_TYPES.items():
            if drive_key in query_lower:
                result["filters"]["drive"] = drive_label
                break
        else:
            result["missing"].append("drive")

        for coat_key, coat_label in COATINGS.items():
            if coat_key in query_lower:
                result["filters"]["coating"] = coat_label
                break
        else:
            result["missing"].append("coating")

        oem_code = _detect_oem(query)
        if oem_code:
            result["filters"]["oem_code"] = oem_code

    else:
        topic = _detect_docseek_topic(query_lower)
        if topic:
            result["filters"]["category"] = topic
        else:
            result["missing"].append("category")

        oem_code = _detect_oem(query)
        if oem_code:
            result["filters"]["oem_code"] = oem_code
        else:
            result["missing"].append("oem_code")

        intent = _detect_docseek_intent(query_lower)
        if intent:
            result["filters"]["intent"] = intent
        else:
            result["missing"].append("intent")

    return result


def build_where_filter(track_result: dict[str, Any]) -> dict[str, Any]:
    where: dict[str, Any] = {"module": track_result.get("module", "docseek")}

    for key, value in track_result.get("filters", {}).items():
        if key in METADATA_FILTER_KEYS:
            where[key] = value

    return where
