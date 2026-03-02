import os
import json
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from dotenv import load_dotenv

load_dotenv()

def extract_prereq_edges(text):
    # text is expected to be a JSON string representing a list of subtopic objects:
    # [{"name": "...", "summary": "...", "equations": "..."}, ...]

    prereq_schema = {
        "title": "PrerequisiteEdges",
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "edges": {
                "type": "array",
                "minItems": 0,
                "maxItems": 200,
                "items": {
                    "type": "array",
                    "minItems": 2,
                    "maxItems": 2,
                    "items": {"type": "string"},
                },
            }
        },
        "required": ["edges"],
    }
    prompt = f"""
        You are given a JSON list of subtopics. Each subtopic has:
        - name (string)
        - summary (string)
        - equations (string)

        Your task: infer prerequisite relationships between subtopics, using ONLY the given names and summaries.

        Return ONLY valid JSON with this exact shape:
        {{"edges":[["prerequisite_topic_name","dependent_topic_name"], ...]}}

        Rules:
        - No markdown, no commentary, no extra keys.
        - Each edge must be a 2-item list of strings: ["A","B"] meaning A is a prerequisite for B.
        - Use topic names EXACTLY as provided in the input JSON (case + punctuation must match).
        - An edge (A -> B) means: understanding A is necessary or strongly helpful before learning B.
        - Avoid trivial edges (A -> A).
        - Avoid weak “related/analogous” links that are not prerequisites.
        - Only include an edge if the dependency is clear from the summaries.
        - If there are no clear prerequisites, return {{"edges":[]}}.

        INPUT JSON LIST:
        {text}
        """

    llm = init_chat_model(
        "openai:gpt-4.1-mini",
        temperature=0,
        api_key=os.getenv("OPENAI_API_KEY"),
    )

    agent = create_agent(
        model=llm,
        tools=[],
        response_format=ProviderStrategy(prereq_schema),
        system_prompt="You are an educational expert mapping prerequisite dependencies between subtopics.",
    )
    result = agent.invoke({"messages": [{"role": "user", "content": prompt}]})

    print(result)
    print()
    if isinstance(result, dict) and "structured_response" in result:
        return result["structured_response"]["edges"]

    # fallback (if some run returns only text)
    raw = ""
    if isinstance(result, dict):
        msgs = result.get("messages", [])
        if msgs:
            raw = getattr(msgs[-1], "content", "")
    else:
        raw = getattr(result, "content", str(result))

    data = json.loads(raw)
    return data["edges"]