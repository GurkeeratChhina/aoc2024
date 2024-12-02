import requests
import os
import re
from datetime import datetime

class Client:
    def __init__(self, session_id):
        self.session = requests.Session()
        self.session.cookies.set('session', session_id)
        
        now = datetime.now()
        self.day = now.day
        self.month = now.month
        if self.month != 12: 
            self.year = now.year-1
        else:
            self.year = now.year

    def get_input(self):
        if self.month != 12:
            max_date = 25
        else:
            max_date = min(self.day, 25)

        for day in range (1, max_date+1):
            # check if file exists
            if not os.path.isfile(f"data/d{day}.txt"):
                print(f"Getting input data and generating template file for day {day}")
                url = f'https://adventofcode.com/{self.year}/day/{day}/input'
                response = self.session.get(url)
                with open(f"data/d{day}.txt", 'w') as f:
                    f.write(response.text)
                with open("data/template.txt") as template, open(f"solutions/d{day}.js", 'w') as newfile:
                    for line in template:
                        output = re.sub(r'd1',f'd{day}' , line)
                        newfile.write(output)

            

def main():
    with open("data/session.txt") as f:
        lines = f.readlines()
        sess_id = lines[0].strip()

    client = Client(sess_id)
    client.get_input()

if __name__ == '__main__':
    main()