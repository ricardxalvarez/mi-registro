from sqlalchemy import Result
from typing import Any


class ResultParser:
    def __init__(self, result: Result[Any]) -> list:
        self.result = result
    
    async def first(self):
        response = await self.all()
        try:
            return response[0]
        except IndexError:
            return None
    
    async def all(self) -> list:
        # Convert each row to a dictionary using column names
        column_names = self.result.keys()
    
        # Extract column names
        column_values = self.result.fetchall()
        response = [dict(zip(column_names, row)) for row in column_values]
        self.response = response
        return response