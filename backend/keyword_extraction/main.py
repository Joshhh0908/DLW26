from llm import extract_keywords
from graph_builder import build_notes, create_equation_links

def process_slides(text):

    keywords = extract_keywords(text)

    notes = build_notes(keywords, text)

    create_equation_links(notes)

    return notes


if __name__ == "__main__":

    with open("slides.txt", "r") as f:
        slides = f.read()

    notes = process_slides(slides)

    for note in notes:
        print("\n====================")
        print("Concept:", note.name)
        print("Equations:", note.equations)
        print("Links:")
        for link in note.links:
            print(f"  -> {link.target} ({link.type}) score={link.score:.2f}")