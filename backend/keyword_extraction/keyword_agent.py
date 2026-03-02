import os
import json
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy
from dotenv import load_dotenv

load_dotenv()

def extract_keywords(text):
    subtopic_schema = {
        "title": "SubtopicExtraction",
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "items": {
                "type": "array",
                "minItems": 6,
                "maxItems": 12,
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "keyword": {"type": "string"},
                        "summary": {"type": "string"},
                        "equation": {"type": "string"},
                    },
                    "required": ["keyword", "summary", "equation"],
                },
            }
        },
        "required": ["items"],
    }

    prompt = f"""
You are extracting technical subtopics from the provided text.

Return ONLY valid JSON with this exact shape:
{{"items":[{{"keyword":"...","summary":"...","equation":"..."}}, ...]}}

Rules:
- No markdown, no commentary, no extra keys.
- 6–12 items.
- summary: at least 6 sentences, based ONLY on the provided text.
- equation: LaTeX if present, else "".

INPUT TEXT:
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
        response_format=ProviderStrategy(subtopic_schema),
        system_prompt="You are an educational expert extracting technical keywords and subtopics.",
    )
    result = agent.invoke({"messages": [{"role": "user", "content": prompt}]})

    print(result)
    if isinstance(result, dict) and "structured_response" in result:
        return result["structured_response"]["items"]

    # fallback (if some run returns only text)
    raw = ""
    if isinstance(result, dict):
        msgs = result.get("messages", [])
        if msgs:
            raw = getattr(msgs[-1], "content", "")  # last AI message content
    else:
        raw = getattr(result, "content", str(result))

    data = json.loads(raw)
    return data["items"]