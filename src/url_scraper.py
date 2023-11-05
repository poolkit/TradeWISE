import requests
from bs4 import BeautifulSoup
import json

class FetchTextFromURL():
    def __init__(self, url):
        self.url = url

    def simple_scraper(self, response):
        soup = BeautifulSoup(response.content, 'html.parser')
        text_elements = soup.find_all(class_='body-KX2tCBZq body-pIO_GYwT content-pIO_GYwT')
        text_data = [p_tag.get_text() for element in text_elements for p_tag in element.find_all("p")]

        if not text_data:
            raise TypeError("List is empty")

        return ' '.join(text_data)

    def complex_scraper(self, response):
        try:
            soup = BeautifulSoup(response.content, 'html.parser')
            text_elements = soup.find(class_="tv-content")

            props_id = text_elements.find('div', class_='js-news-story-container').get('data-props-id', None)
            script_div = text_elements.find('script', type='application/prs.init-data+json')
            json_data = json.loads(script_div.string)

            ast_description = json_data[props_id]['story']['astDescription']
            children = ast_description['children']
            p_type_children = [child['children'][0] for child in children if child['type'] == 'p']

            return ' '.join(p_type_children)
        
        except Exception as e:
            raise e

    def fetch_article(self):
        try:
            response = requests.get(self.url)

            if response.status_code == 200:
                try:
                    processed_text = self.simple_scraper(response)
                except Exception:
                    processed_text = self.complex_scraper(response)
            
                return processed_text

            else:
                print(f"Failed to fetch data. Status code: {response.status_code}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None

if __name__=="__main__":
    # url = "https://in.tradingview.com/news/moneycontrol:2048c93b5094b:0-adani-ports-records-48-growth-in-cargo-volumes-at-37-million-tonnes-in-oct/"
    # url = "https://in.tradingview.com/news/financemagnates:cb3e7b789094b:0-binance-morgan-stanley-kraken-and-more-executive-moves-of-the-week/"
    # url = "https://in.tradingview.com/news/DJN_SN20231104002098:0/"
    # url = "https://in.tradingview.com/news/DJN_SN20231104001905:0/"
    # url = "https://in.tradingview.com/news/te_news:392280:0-egypt-non-oil-private-sector-pmi-slips-to-5-month-low/"



    url = "https://in.tradingview.com/news/cointelegraph:759c80cff094b:0-what-is-metadata-in-blockchain-transactions/"
    processor = FetchTextFromURL(url)
    print(processor.fetch_article())