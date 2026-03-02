import ollama
import json

def extract_keywords(text: str):
    prompt = f"""
    You are an expert in extracting technical keywords.

    This is the text you are summarizing

    Text:
    {text}


Follow these instructions EXACTLY:

1. Extract 6–12 core technical concept keywords from the text.
2. Output MUST be valid JSON.
3. Output ONLY a JSON array.
4. Do NOT include explanations, headings, markdown, or extra text.
5. Each item must have EXACTLY these keys:
   - "keyword"
   - "summary"
   - "equation"
6. The summary MUST contain material from the slides.
7. The summary MUST contain more than 5 sentences. If it does not, discard that keyword.
8. If no equation exists, use "".
9. Equations must be LaTeX-compatible.
10. The JSON must be syntactically valid.

The JSON array must follow this structure exactly but be applied for the text above.:
    [
    {{
        "keyword": "",
        "summary": "",
        "equation": ""
    }},
    {{
        "keyword": "",
        "summary": "",
        "equation": ""
    }},
    
    ]
    Return ONLY the JSON array.
    """

    response = ollama.chat(
        model="llama2:7b",
        messages=[{"role": "user", "content": prompt}],
        options={
            "temperature": 0  # IMPORTANT for rigidity
        }
    )

    content = response["message"]["content"].strip()

    print(content)

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        # Optional safety cleanup if model adds stray text
        start = content.find("[")
        end = content.rfind("]") + 1
        parsed = json.loads(content[start:end])
    print("Hello")
    print(parsed)
    print("BYE BYE")
    # Convert JSON objects into the SAME output structure you had before:
    returnArray = [
        [item["keyword"], item["summary"], item["equation"]]
        for item in parsed
    ]
    print(returnArray)


    return returnArray