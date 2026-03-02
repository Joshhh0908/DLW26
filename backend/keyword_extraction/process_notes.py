from .keyword_agent import extract_keywords
from .graph_builder import create_equation_links, generate_graph
from .models import Node
from dataclasses import asdict
import PyPDF2

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file."""
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def build_notes(keywords, text=None) -> list[Node]:
    """
    Build Note objects from LLM-extracted keywords.
    Each keyword is expected to be [name, summary, equation].
    Keeps the same function signature and return type.
    """
    notes = []
    for keyword in keywords:
        # unpack keyword parts safely
        name = keyword["keyword"].strip()
        summary = keyword["summary"].strip()
        equation = (keyword.get("equation") or "").strip()
        note = Node(
            name=name,
            summary=[summary],
            equations=[equation] if equation else []
        )
        notes.append(note)
    return notes

def process_slides(text) -> list[Node]:
    keywords = extract_keywords(text)
    print("keywords extracted")
    notes = build_notes(keywords, text)
    print("note objects made")
    return notes

def process_notes(pdf_files):
    notes = []
    graphs = []
    keywords_set = set()

    # Process each PDF
    for pdf_file in pdf_files:
        text = extract_text_from_pdf(pdf_file)
        print("pdf to text done")
        note = process_slides(text)
        notes.append(note)

    for note in notes:
        graph = generate_graph(note)
        graphs.append(graph)
    # Print the results
    for note in notes:
        to_print = [asdict(keyword) for keyword in note]
        print("===============================================")

        print()
        print()
        print()
        print()
        print("===============================================")
        print(to_print)
        # for topic in note:
        #     # print("\n====================")
        #     # print("Concept:", note.name)
        #     # print("Summary: ", note.associated_phrases)
        #     # print("Equations:", note.equations)
        #     # print("Links:")
        #     for link in topic.links:
        #         print(f"  -> {link.target} ({link.type}) score={link.score:.2f}")
        #     # Collect keywords
        #     keywords_set.add(topic.name)
    print()
    print()
    print()
    print()
    print("======================================================")
    for graph in graphs:
        print(graph)

    # Append all keywords to output file
    with open("all_keywords.txt", "w", encoding="utf-8") as f:
        for keyword in sorted(keywords_set):
            f.write(keyword + "\n")

    print("\nAll keywords saved to all_keywords.txt")

    return notes, graphs
