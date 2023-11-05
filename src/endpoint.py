from fastapi import FastAPI
from src.api_caller import OpenAPICaller
from src.url_scraper import FetchTextFromURL
from pydantic import BaseModel

app = FastAPI()

class InputData(BaseModel):
    openai_api_key: str
    url: str

@app.get("/")
def home_page():
    return "Welcome to TradeWISE"

@app.post("/summarise")
def summarise(input_data: InputData):
    
    openai_api_key = input_data.openai_api_key
    input_url = input_data.url

    processor = FetchTextFromURL(input_url)
    processed_text = processor.fetch_article()

    gptllm = OpenAPICaller(openai_api_key)
    result = gptllm.run_llm(processed_text)

    try:
        summary = result.split('\n\n')[0]
        sentiment = result.split('\n\n')[1].split(': ')[1]
        
        return {"Summary": summary, "Sentiment": sentiment}

    except:
        return {"Result": result}