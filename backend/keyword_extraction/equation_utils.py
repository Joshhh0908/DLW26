import sympy as sp
from collections import Counter

# No need for regex parsing anymore
def extract_equations(text):
    """
    Placeholder to keep the same signature.
    When using LLM-extracted keywords, this is not needed.
    Returns empty list to keep function signature compatible.
    """
    return []

def normalize_equation(eq_str):
    try:
        # simple sympify replacement for safe parsing
        expr = sp.sympify(eq_str.replace("^", "**"))
        symbols = sorted(expr.free_symbols, key=lambda x: str(x))
        mapping = {s: sp.Symbol(f"x{i}") for i, s in enumerate(symbols)}
        normalized = expr.subs(mapping)
        return sp.simplify(normalized)
    except:
        return None

def tree_signature(expr):
    if expr is None:
        return None

    nodes = []

    def traverse(e):
        nodes.append(type(e).__name__)
        for arg in getattr(e, "args", []):
            traverse(arg)

    traverse(expr)
    return Counter(nodes)

def structural_similarity(sig1, sig2):
    if sig1 is None or sig2 is None:
        return 0.0

    intersection = sum((sig1 & sig2).values())
    union = sum((sig1 | sig2).values())
    return intersection / union if union else 0.0

def are_isomorphic(expr1, expr2):
    try:
        return sp.simplify(expr1 - expr2) == 0
    except:
        return False