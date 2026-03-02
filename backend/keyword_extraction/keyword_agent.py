import os
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.agents.structured_output import ProviderStrategy  # if this exists in your version

def extract_keywords(text):
    subtopic_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
        "keyword": {"type": "string"},
        "summary": {"type": "string"},
        "equation": {"type": "string"}
        },
        "required": ["keyword", "summary", "equation"]
    },
    "minItems": 6,
    "maxItems": 12
    }

    prompt =  """
    You are extracting technical subtopics from the provided text.

    INPUT TEXT:
    {text}

    OUTPUT FORMAT (STRICT):
    - Return ONLY a JSON array (no markdown, no commentary, no extra keys).
    - Each array item MUST be an object with EXACTLY these keys in double quotes:
    "keyword", "summary", "equation"
    - Use valid JSON: double quotes only, no trailing commas, no NaN/Infinity.

    TASK:
    1) Identify 6–12 core technical concepts present in the text (use concise noun phrases).
    2) For EACH concept, write a summary that:
    - is based ONLY on the provided text (do not invent facts),
    - is at least 6 sentences long,
    - is specific (mentions definitions, steps, assumptions, or key relationships stated in the text).
    3) For "equation":
    - If the text provides an equation or a clear formula related to the concept, include it in LaTeX (no surrounding $$).
    - Otherwise set "equation" to "" (empty string).

    QUALITY RULES:
    - If a candidate concept cannot meet the 6+ sentence summary requirement using ONLY the text, DO NOT include it.
    - If you end up with fewer than 6 items, expand by selecting additional valid concepts from the text until you reach at least 6.
    - Avoid duplicates / near-duplicates.

    RETURN ONLY THE JSON ARRAY.
    """

    llm = init_chat_model(
        "openai:gpt-5",
        temperature=0,
        api_key=os.getenv("OPENAI_API_KEY"),  # optional; env var alone also works
    )

    agent = create_agent(
        model=llm,
        tools=[],
        response_format=ProviderStrategy(subtopic_schema),
        system_prompt="You are an educational expert, extracting technical keywords and subtopics out of a chunk of text",
    )

    result = agent.invoke({"messages": [{"role": "user", "content": prompt.format(text=text)}]})
    
    print(result)