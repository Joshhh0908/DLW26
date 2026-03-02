from llm import extract_keywords
from graph_builder import build_notes, create_equation_links
import PyPDF2

# List of your PDF notes
pdf_files = [
    "Systems.pdf",
]
demarcator_keywords = "*~*"
demarcator_sections = "^&^"

def process_slides(text):
    keywords = extract_keywords(text)
    notes = build_notes(keywords, text)
    create_equation_links(notes)
    return notes

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

def main():
    all_notes = []
    all_keywords_set = set()

    # Process each PDF
    for pdf_file in pdf_files:
        text = extract_text_from_pdf(pdf_file)
        notes = process_slides(text)
        all_notes.extend(notes)

    # Generate cross-note equation links
    create_equation_links(all_notes)

    # Print the results
    for note in all_notes:
        print("\n====================")
        print("Concept:", note.name)
        print("Equations:", note.equations)
        print("Links:")
        for link in note.links:
            print(f"  -> {link.target} ({link.type}) score={link.score:.2f}")
        # Collect keywords
        all_keywords_set.add(note.name)

    # Append all keywords to output file
    with open("all_keywords.txt", "w", encoding="utf-8") as f:
        for keyword in sorted(all_keywords_set):
            f.write(keyword + "\n")

    print("\nAll keywords saved to all_keywords.txt")

if __name__ == "__main__":
    main()