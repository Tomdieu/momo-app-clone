import requests
import json
import os

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

class Convert:

    def convert(self,from_currency:str,to_currency:str,amount):
        """
        ## Paramerters:

            `from_currency: str`:
                summary : 'The currency you want to convert'
                example : 'USD'
            `to_currency: str`:
                summary : 'The currency to which you want to convert'
                example : 'XAF'
            `amount: float`:
                summary: 'The ammount you are converting'
                example : 2000 
        """    
        initial_amount = float(amount)
        amount = float(amount)

        if from_currency != 'USD':
            amount = amount / self.currencies[from_currency]

        # limiting the precision to 4 dp

        amount = round(amount *self.currencies[to_currency],4)

        return amount

class RealTimeCurrencyConverter(Convert):

    def __init__(self,url='https://api.exchangerate-api.com/v4/latest/USD'):
        super().__init__()

        self.data = json.loads(requests.get(url).content)
        self.currencies = self.data['rates']      

    

class OffLineCurrencyConverter(Convert):

    def __init__(self):
        super().__init__()
        f = open(os.path.join(BASE_DIR,'utils','rates.json'))
        self.data = json.load(f)
        self.currencies = self.data['rates']

def converCurrency(from_currency:str,to_currency:str,amount) -> float:
    """
    # Convert a currency to another
        
    ## Arguments:
        `from_currency: str`: 
            currency you want to convert from
        `to_currency: str`: 
            currency you want to convert from
        `amount : float | int`: 
            the amount you want to convert

    ## Returns:
        float: the amount converted
    """
    
    try:
        converter = RealTimeCurrencyConverter(url)
        return converter.convert(from_currency,to_currency,amount)
    except:
        converter = OffLineCurrencyConverter()
        return converter.convert(from_currency,to_currency,amount)

if __name__ == '__main__':
    try:
        url = 'https://api.exchangerate-api.com/v4/latest/USD'
        converter = RealTimeCurrencyConverter(url)
        print(converter.convert('USD','XAF',100))
    except:
        c = OffLineCurrencyConverter()
        print(c.convert('USD','XAF',100))
    # v = [(i,i) for i in self.data['rates'].keys()]


        # with open('curr.txt','w') as f:
        #     f.write(f'{v}')
        # with open('rates.json','w') as f:
        #     json.dump(self.data,f,ensure_ascii=True,indent=4)