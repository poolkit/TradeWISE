import requests
from bs4 import BeautifulSoup

class FetchTextFromURL():
    def __init__(self, url):
        self.url = url

    def fetch_article(self):
        try:
            response = requests.get(self.url)

            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                text_elements = soup.find_all(class_='body-KX2tCBZq body-pIO_GYwT content-pIO_GYwT')
                text_data = [p_tag.get_text() for element in text_elements for p_tag in element.find_all("p")]
                return ' '.join(text_data)
            else:
                print(f"Failed to fetch data. Status code: {response.status_code}")
                return None
            
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None

if __name__=="__main__":
    # url = "https://in.tradingview.com/news/moneycontrol:2048c93b5094b:0-adani-ports-records-48-growth-in-cargo-volumes-at-37-million-tonnes-in-oct/"
    url = "https://in.tradingview.com/news/financemagnates:cb3e7b789094b:0-binance-morgan-stanley-kraken-and-more-executive-moves-of-the-week/"
    processor = FetchTextFromURL(url)
    print(processor.fetch_article())