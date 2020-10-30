import glob
import re
import time


import requests
from bs4 import BeautifulSoup

from random import randint
from time import sleep
import  constants as const
import jsonlines
from itertools import zip_longest
import glob

junk = """
"3. Ziele\n", "    \n", "de\n", "\n", "\n", "\n", "Das Unternehmen legt offen, welche qualitativen und/oder quantitativen sowie zeitlich definierten Nachhaltigkeitsziele gesetzt und operationalisiert werden und wie deren Erreichungsgrad kontrolliert wird.\n", " 
"""
def read_file():
    import glob
    path = '/home/avare/repos/givetastic_recommender/data/company_profile_ndb/text/*.txt'
    files = glob.glob(path)
    with jsonlines.open('doccano_input.txt', mode='w') as writer:
        for file in files:
            f = open(file, 'r')
                        #text = f.read()
            text = f.readlines()
            #text = text.replace("Das Unternehmen legt offen, welche qualitativen und/oder quantitativen sowie zeitlich definierten Nachhaltigkeitsziele gesetzt und operationalisiert werden und wie deren Erreichungsgrad kontrolliert wird.","")
            #text = f.readlines()
            f.close()
            writer.write({'text': text, 'meta': {"file": f.name}})

if __name__ == "__main__":
    read_file()