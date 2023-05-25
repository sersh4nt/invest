from src.db import base
from src.backtest.flows import BackTestStrategyFlow
data = {'robot_id': 2, "figi": "BBG00178PGX3", "date_to": "2023-05-23T20:27:01.111774", "date_from": "2023-02-22T20:27:01.111774", "interval_raw": "hour"}
robot_config = {"figi": "BBG00178PGX3", "strategy": {"name": "ladder", "parameters": {"min_price": "440", "packet": "10", "steps": "15", "percent": "2", "buying": True, "enter_price": "440"}}}        
data['robot_config'] = robot_config
user_id = '9ea4ada1-ca5a-45f1-933a-a20b211b9095'
flow = BackTestStrategyFlow(data, user_id)
flow = BackTestStrategyFlow(data, user_id)
flow.run()
