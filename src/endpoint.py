from fastapi import FastAPI
from src.apicaller import OpenAPICaller
from pydantic import BaseModel

app = FastAPI()

class InputData(BaseModel):
    openai_api_key: str
    article: str

@app.get("/")
def home_page():
    return "Welcome to TradeWISE"

@app.post("/summarise")
def summarise(input_data: InputData):
    
    openai_api_key = input_data.openai_api_key
    input_text = input_data.article

    gptllm = OpenAPICaller(openai_api_key)
    result = gptllm.run_llm(input_text)

    try:
        summary = result.split('\n\n')[0]
        sentiment = result.split('\n\n')[1].split(': ')[1]
        
        return {"Summary": summary, "Sentiment": sentiment}

    except:
        return {"Result": result}