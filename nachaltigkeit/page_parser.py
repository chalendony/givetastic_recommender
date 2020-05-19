import glob
import re


pattern_id_year = 'a class="small_tiles_in"\s+href="(.*)"\s+target'
matcher = re.compile(r"class=\"small_tiles_in\"\s+href=\"(.*)\"\s+target", re.MULTILINE)
id = re.compile(r"https://datenbank2\.deutscher-nachhaltigkeitskodex\.de/Profile/CompanyProfile/(\d+)/de/(\d+)/dnk")


matcher_id_year = re.compile(r"class=\"small_tiles_in\"\s+href=\"https://datenbank2\.deutscher-nachhaltigkeitskodex\.de/Profile/CompanyProfile/(\d+)/de/(\d+)/dnk\"\s+target", re.MULTILINE)


def get_file_list(dir):
    files_lst = glob.glob(dir)

    for i in files_lst:
        print(f"file list {i}")
        with open(i) as file:
            txt = contents = file.read()
            m = matcher_id_year.findall(txt)
            if m:
                print(m)


def get_file_list_workis(dir):
    files_lst = glob.glob(dir)

    for i in files_lst:
        print(f"file list {i}")
        with open(i) as file:
            txt = contents = file.read()
            m = matcher.findall(txt)
            if m:
                print(type(m))
                # get id
                for t in m:
                    id_year = id.findall(t)
                    print(id_year)

    return files_lst


if __name__ == "__main__":
    get_file_list("/home/avare/repos/givetastic_recommender/data/ndb_raw/*.html")
