import os
import configuration
from pathlib import Path

root_dir = configuration.root_dir

min_secs = 10
#max_secs = 300
max_secs = 15
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:45.0) Gecko/20100101 Firefox/45.0'}
ziel_path = '/home/avare/repos/givetastic_recommender/data/company_profile_ndb/ziel/'
alphabet_path = "/home/avare/repos/givetastic_recommender/data/raw/alphabet_listing/*.html"

# not used at currently
#profile_url = f"https://datenbank2.deutscher-nachhaltigkeitskodex.de/Profile/CompanyProfile/{company}/de/{year}/dnk"