from models import Note, Link
from equation_utils import (
    extract_equations,
    normalize_equation,
    tree_signature,
    structural_similarity,
    are_isomorphic
)


def build_notes(keywords, text=None):
    """
    Build Note objects from LLM-extracted keywords.
    Each keyword is expected to be [name, concept, equation].
    Keeps the same function signature and return type.
    """
    notes = []

    for keyword in keywords:
        # unpack keyword parts safely
        name = keyword["keyword"].strip()
        concept = keyword["summary"].strip()
        equation = keyword["equation"].strip() if len(keyword) > 2 else ""

        note = Note(
            name=name,
            associated_phrases=[concept],
            equations=[equation] if equation else []
        )

        notes.append(note)

    return notes


def create_equation_links(notes, max_links=3, similarity_threshold=0.4):

    eq_data = []

    for note in notes:
        for eq in note.equations:
            norm = normalize_equation(eq)
            sig = tree_signature(norm)
            eq_data.append((note, eq, norm, sig))

    # pairwise comparison
    for i in range(len(eq_data)):
        note_i, eq_i, norm_i, sig_i = eq_data[i]

        scores = []

        for j in range(len(eq_data)):
            if i == j:
                continue

            note_j, eq_j, norm_j, sig_j = eq_data[j]

            score = structural_similarity(sig_i, sig_j)

            if score >= similarity_threshold:
                link_type = "related"

                if are_isomorphic(norm_i, norm_j):
                    link_type = "analogous"

                scores.append((note_j.name, link_type, score))

        # keep top N
        scores = sorted(scores, key=lambda x: x[2], reverse=True)[:max_links]

        for target, link_type, score in scores:
            note_i.links.append(Link(target, link_type, score))