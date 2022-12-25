from ibapi.client import EClient
from ibapi.wrapper import EWrapper
from ibapi.contract import Contract

import threading
import time
from datetime import datetime
import json


class IBapi(EWrapper, EClient):
    def __init__(self):
        EClient.__init__(self, self)

    def tickPrice(self, reqId, tickType, price, attrib):
        # if tickType == 1 and reqId == 1:
        #     print(f'The current TSLA bid price is: {price}, {datetime.now()}')
        # elif tickType == 2 and reqId == 1:
        #     print(f'The current TSLA ask price is: , {price}, {datetime.now()}')
        # elif tickType == 4 and reqId == 1:
        #     # print(f'The current TSLA last price is: , {price}, {datetime.now()}')
        #     write_price_json(price, datetime.now(), 'TSLA')
        
        if tickType == 4 and reqId == 1:
            print(f'The current TSLA last price is: , {price}, {datetime.now()}')
            symbol = 'TSLA'
            self.write_price_json(price, datetime.now(), f"{symbol.lower()}_price.json")
    
    def tickSize(self, reqId, tickType, size):
        # if tickType == 0 and reqId == 1:
        #     print(f'The current TSLA bid size is: , {size}, {datetime.now()}')
        # elif tickType == 3 and reqId == 1:
        #     print(f'The current TSLA ask size is: , {size}, {datetime.now()}')
        # elif tickType == 8 and reqId == 1:
        #     print(f'The current TSLA volume is: , {size}, {datetime.now()}')
        
        if tickType == 8 and reqId == 1:
            print(f'The current TSLA volume is: , {size}, {datetime.now()}')
            symbol = 'TSLA'
            self.write_price_json(size, datetime.now(), f"{symbol.lower()}_volume.json")
    
    def historicalData(self, reqId, bar):
        print(f'Time: {bar.date} Close: {bar.close}')
    
    def write_price_json(self, price, dateTime, file_name):
        # Data to be written
        dictionary = {
            "value": price,
            "date": dateTime.strftime("%m/%d/%Y %H:%M:%S")
        }
        # Serializing json
        json_object = json.dumps(dictionary, indent=4)
        
        # Writing to sample.json
        with open(f"json/{file_name}", "w") as outfile:
            outfile.write(json_object)


def run_loop():
    app.run()

app = IBapi()
app.connect('127.0.0.1', 4002, 123)

#Start the socket in a thread
api_thread = threading.Thread(target=run_loop, daemon=True)
api_thread.start()

time.sleep(1) #Sleep interval to allow time for connection to server

#Create contract object
stock_contract = Contract()
stock_contract.symbol = 'TSLA'
stock_contract.secType = 'STK'
stock_contract.exchange = 'SMART'
stock_contract.currency = 'USD'

#Request Market Data
app.reqMktData(1, stock_contract, '', False, False, [])
# app.reqHistoricalData(1, stock_contract, '', '900 S', '1 secs', 'BID', 0, 2, False, [])

# time.sleep(10) #Sleep interval to allow time for incoming price data
# app.disconnect()

# Time: 1671745074 Close: 125.06
# Time: 1671745484 Close: 124.95