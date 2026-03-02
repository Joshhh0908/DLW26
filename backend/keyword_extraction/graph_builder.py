from dataclasses import asdict

from .models import Link, Node
from .equation_utils import (
    extract_equations,
    normalize_equation,
    tree_signature,
    structural_similarity,
    are_isomorphic
)
from .pre_requisite_agent import extract_prereq_edges
from sentence_transformers import SentenceTransformer, util
import numpy as np
import json



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

def generate_related(notes : list[Node]):
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

    embeddings = model.encode([f"Topic: {note.name} Description: {note.summary}" for note in notes], normalize_embeddings=True)
    sim_matrix = util.cos_sim(embeddings, embeddings).cpu().numpy()  # (N, N)
    threshold = 0.7
    related_edges = []

    n = len(notes)
    for i in range(n):
        for j in range(i + 1, n):
            s = sim_matrix[i, j]
            if s >= threshold:
                related_edges.append((notes[i].name, notes[j].name))

    return related_edges

def generate_prerequisite(notes: list[Node]):
    subtopics = [asdict(note) for note in notes]

    pre_requisite_edges = extract_prereq_edges(json.dumps(subtopics, ensure_ascii=False))
    return pre_requisite_edges

def generate_graph(notes: list[Node]):
    related = generate_related(notes)
    pre_req = generate_prerequisite(notes)
    return (related, pre_req)