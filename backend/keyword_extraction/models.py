from dataclasses import dataclass, field
from typing import List

@dataclass
class Link:
    target: str
    type: str  # "analogous" | "related"
    score: float

@dataclass
class Node:
    name: str
    summary: List[str] = field(default_factory=list)
    equations: List[str] = field(default_factory=list)
    links: List[Link] = field(default_factory=list)