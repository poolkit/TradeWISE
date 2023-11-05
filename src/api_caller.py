from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate

class OpenAPICaller():
    def __init__(self, openai_api_key):

        self.openai_api_key = openai_api_key
        
        prompt_template = """
        You are a financial helper agent. You'll strictly follow the below instructions. You'll be provided an article. Your job is to
        - Give a 3-4 lines summary if the article is short.
        - You can go to 6-7 lines if the article is huge.
        - Do not use bullet point as any costs.
        - Also in a new last line, write "CATEGORY: " and choose one category from the list that suits it [Very Bullish, Bullish, Neutral, Bearish, Very Bearish]
        
        The article is:

        {article}
        """
        
        self.prompt = PromptTemplate(
            input_variables = ['article'],
            template = prompt_template
            )

        self.llm = ChatOpenAI(
            openai_api_key=self.openai_api_key,
            temperature=0,
            model_name="gpt-3.5-turbo"
            )

        self.llm_chain = LLMChain(
            llm=self.llm, 
            prompt=self.prompt
            )

    def run_llm(self, article:str):
        output = self.llm_chain.run(article)
        return output


if __name__=="__main__":
    llm = OpenAPICaller()
    article = """
    The software giant beat on both revenue and net income guidance as demand for AI-enabling services soared.

    Amazon stock 
    AMZN is looking to open 5.4% to the upside Friday after the company posted a whopping quarterly profit. For the three months to September, the software powerhouse notched $9.9bn in profits, more than triple from a year ago, and eclipsed expectations of $6.05bn.
    Translated to earnings per share, Amazon scooped up 94 cents a share, comfortably above the Wall Street consensus call of 58 cents. Revenue for the quarter came in at $143bn, a 13% increase, beating analysts’ $141.5bn forecast. Fourth-quarter guidance now sits at $160bn to $167bn in sales.
    Strong sales in Amazon’s cloud-computing, Amazon Web Services, or AWS, boosted both the top and bottom line, sales and profit. Chief executive Andy Jassy noted that AWS revenue rose 12% to $23.1bn on elevated business demand for the company’s AI platform, named Bedrock.
    """
    print(llm.prompt.format(article=article))
    print("*"*100)
    result = llm.run_llm(article)
    print(result)
