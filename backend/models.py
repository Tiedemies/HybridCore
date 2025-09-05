from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime


class EntryIn(BaseModel):
    title: str
    description: str
    timestamp: datetime
    region: Optional[str] = None
    country: Optional[str] = None
    subregion: Optional[str] = None
    domain: Optional[str] = None
    space: Optional[str] = None
    layer: Optional[str] = None
    cascading_effect: Optional[Dict[str, float]] = {}


class EntryOut(EntryIn):
    id: str


class SearchQuery(BaseModel):
    query: Optional[str] = None
    filters: Optional[Dict[str, str]] = {}
    top_k: int = 5
