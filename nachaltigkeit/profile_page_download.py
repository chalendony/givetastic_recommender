"""
collection data
clean data
--- error ,
debug
repeat collection data
clean data

"""
import glob
import re
import time


import requests
from bs4 import BeautifulSoup

from random import randint
from time import sleep
import  constants as const
import jsonlines


mathcher_name_id = re.compile(r"span class='cEditName'>(.*?)<\/span><span\s*id='arrow_(.*?)'", re.MULTILINE)

def load_id_date_mapping():
    profile_meta = {}
    # :response§§§§§16§§§§§:response §§§§§11048
    with open("/home/avare/repos/givetastic_recommender/data/raw/input_data.txt", encoding="utf8", errors='ignore') as f:
        for line in f:
            # split
            sp = line.split("§§§")
            name = sp[0].strip()
            year = sp[1].strip()
            company_id = sp[3].strip()

            #print(f"{sp[0]}, {sp[1]}, {sp[2]}, {sp[3]}")
            if 'xxx' not in name:

                if len(year) > 0:
                    year = int(sp[1].strip()) + 2000
                    #print(year)
                    ziel_url = f"https://datenbank2.deutscher-nachhaltigkeitskodex.de/Profile/MainMenuHandler/2_3?company={company_id}&year={year}&lang=de&culture=de"
                    profile_meta[company_id] = {'ziel_url':ziel_url, 'name':name, 'year':year}
                    ## todo create jsonl dump as you go...
                    print(ziel_url)

    #print(profile_meta)


def dump_jsonl(data, output_path, append=False):
    """
    Write list of objects to a JSON lines file.
    """
    mode = 'a+' if append else 'w'
    with open(output_path, mode, encoding='utf-8') as f:
        for line in data:
            json_record = json.dumps(line, ensure_ascii=False)
            f.write(json_record + '\n')
    print('Wrote {} records to {}'.format(len(data), output_path))


def get_profile_url():
    m = mathcher_name_id.findall(const.frame_source)
    if m:
        print(len(m))
        for p in m:
            company_id = p[0]
            name = p[1]
            print(f"{company_id} §§§ {name}")
            # company year

            # construct profile_url


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

    load_id_date_mapping()
    #get_profile_url()
