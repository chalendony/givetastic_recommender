"""
Get text from url and store for upload to Amazon Labeling
"""
import re
from nachaltigkeit.profile_page_download import download
infile = "/home/avare/repos/givetastic_recommender/data/company_profile_ndb/nachhaltigkeitskodex_links.txt"

mathcher_id = re.compile(r"company=(\d*)&year", re.MULTILINE)

pattern = 'company=(\d*)&year'

def gettext():
    lst = read_file_contents("/home/avare/repos/givetastic_recommender/data/company_profile_ndb/nachhaltigkeitskodex_links.txt")
    for i in lst:
        print(i)
        id = get_profile_id(i)
        print(id)
        if id is not None:
            txt = download(i, True)
            # create filename
            filename = f"/home/avare/repos/givetastic_recommender/data/company_profile_ndb/text/{id}.txt"
            with open(filename, "w") as file:
                file.write(txt)


def read_file_contents(filename):
    with open(filename) as file:
        txt = contents = file.readlines()
        return txt

def get_profile_id(text):
    res = None
    m = re.search(mathcher_id, text)
    if m is not None:
        res = m.groups(1)[0]
    return res


if __name__ == "__main__":

    gettext()
    #get_profile_url()
