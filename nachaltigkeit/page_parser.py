"""
Step 1- manually download alphabetic listing of all companies
Step 2- parse alphabetic listing to extract:  company id and year from alphabetic listing - at this time save desired features of the company profile such as
ziel, etc....
3-
"""

import glob
import re
import time


import requests
from bs4 import BeautifulSoup

from random import randint
from time import sleep
import  constants as const

matcher_id_year = re.compile(r"class=\"small_tiles_in\"\s+href=\"https://datenbank2\.deutscher-nachhaltigkeitskodex\.de/Profile/CompanyProfile/(\d+)/de/(\d+)/dnk\"\s+target", re.MULTILINE)

# def parse_strategy(dir):
#     files_lst = glob.glob(dir)
#     for i in files_lst:
#         ziel_text = read_file_contents(i)
#         print(ziel_text)
#         save(ziel_text, company):
#         #  store to file

def parse_company_zeil(dir):
    files_lst = glob.glob(dir)
    for i in files_lst:
        print(f"file list {i}")
        with open(i) as file:
            txt = contents = file.read()
            m = matcher_id_year.findall(txt)
            if m:
                print(m)
                for p in m:
                    company = p[0]
                    year = p[1]
                    ziel_url = f"https://datenbank2.deutscher-nachhaltigkeitskodex.de/Profile/MainMenuHandler/2_3?company={company}&year={year}&lang=de&culture=de"
                    print(f"downloading {ziel_url}")
                    text = download(ziel_url, astext=True)
                    filename = f"/home/avare/repos/givetastic_recommender/data/company_profile_ndb/ziel/{company}_{year}.txt"
                    save(text, filename)
                    time.sleep(5)


def read_file_contents(filename):
    with open(filename) as file:
        txt = contents = file.read()
        return txt

def save(text, filename):
    print(filename)
    try:
        with open(filename, "w") as file:
            file.write(text)
    except Exception as e:
        print("Exception: skipping " + filename)


def download(url, astext=False):
    try:
        response = requests.get(url, headers=const.headers) #  send request
        if response.status_code == 200:
            #print(response.status_code, 'OK')
            pass
    except requests.exceptions.ConnectionError:
        print('Something wrong ')
        return False
    soup = BeautifulSoup(response.text, "lxml")  #  parse web page
    html = soup.prettify("utf-8")
    if astext:
        html = soup.text
    return html

if __name__ == "__main__":

    ##############
    ## Step 2 :
    ##############
    parse_company_zeil(const.alphabet_path)

    #NEXT:
    # get name and - id pairs from /de.html file
    # <span class="cEditName">Frischpack GmbH</span><span id="arrow_10032" class="arrow">
    # view frame source to bind name etc
    #'view-source:file:///home/avare/repos/givetastic_recommender/data/raw/alphabet_listing/Deutscher%20Nachhaltigkeitskodex%20-%20Datenbank_S_files/de.html'
    #'/home/avare/repos/givetastic_recommender/data/raw/alphabet_listing/Deutscher Nachhaltigkeitskodex - Datenbank_C.html'

