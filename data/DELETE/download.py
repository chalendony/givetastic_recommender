import codecs
from requests_html import HTML
from collections import namedtuple
import csv
import glob
import time

out_path = '/home/avare/repos/givetastic_recommender/data/company_profile_ndb'

class Page:
    def __init__(self):
        self.COUNTER = 0

    def load(self, filename):
        f = codecs.open(filename, "r", "ISO-8859-15")
        str = f.read()
        f.close()
        html = HTML(html=str.encode('ISO-8859-15'), default_encoding="ISO-8859-15")
        return html

    def is_empty(self, page):
        target = 'No results for'
        idx = page.text.find(target)
        print(f"Check empty {idx}")
        flag = idx != -1
        return flag

    def parse_all_files(self, dir):
        lst = []
        files_lst = glob.glob(dir)

        ##################################
        # Initialize Batch
        ##################################
        batch = []
        batch_name = "leo_verbs" # move to constants..
        INIT_BATCHNR = 6
        batchnr = INIT_BATCHNR
        for i in files_lst:
            lemma, usage , is_verb = self.parse_from_file(i)
            # parse verbs
            if is_verb:
                print(f"{i}")
                usage = usage[0:]
                leo_res = leo.search(lemma)
                leo_en = leo.get_verbs_english_definitions(leo_res)
                leo_de = leo.de_get_verbs_german_translation(leo_res)
                nl = "\n"
                nl2 = "\n\n"
                comma = ", "
                #entry = f"{lemma} @@@ {nl2.join(usage)}  §§§"
                print(leo_de)
                entry = f"{lemma} @@@ {leo_en} {nl} {leo_de} {nl2} {nl2.join(usage)}  §§§"
                batch.append(entry)
                # wait some seconds
                time.sleep(5)
            # write batch
            if len(batch) == MAX_CARDS:
                self.write_to_file(batch, batchnr, batch_name)
                batch = []
                batchnr = batchnr + 1
        ## if done and nothing written ; small batch
        #if batchnr == INIT_BATCHNR:
        self.write_to_file(batch, batchnr, batch_name)


    def parse_from_file(self, filename):
        is_verb = False
        res = self.load(filename)
        term = self.parse_term(res)
        definition, is_verb = self.parse_definition(res)
        return term, definition, is_verb


    def parse_term(self,res):
        selector = '#ctl00_cC_translate_box > font > div > div > b:nth-child(1) > span'
        res = res.find(selector)
        if len(res) == 0:
            val = None
        else:
            val = res[0].text
        return val


    def parse_definition(self, res):
        lst = []
        is_verb = False
        selector = '#ctl00_cC_translate_box > font > div > div'
        res = res.find(selector)
        if len(res) > 0:
            #lst.append(len(res))
            # peek if verb
            is_verb = self.is_verb(res)
            if is_verb:
                self.COUNTER = self.COUNTER + 1
                for i in res:
                        val = i.text
                        lst.append(val)
        return lst, is_verb

    def is_verb(self,res):
        str = ""
        for i in res:
            str += i.text
        return "ptp" in str or " vt" in str or " vi" in str or " vtr" in str


    def write_to_file(self, lst, batchnr, filename):
        f = open(cards_path + filename + "_" + str(batchnr) + ".txt", 'w')
        with f:
            for i in lst:
                f.write(f"{i}")


    # def write_to_file_batch(self, lst): # dumb just merge this with existing loop!!
    #     batch = []
    #     batchnr= 1
    #     for i in range(0,len(lst)):
    #         batch.append(i)
    #         if len(batch) == MAX_CARDS:
    #             self.write_to_file(batch,batchnr)
    #             batch = []
    #             batchnr = batchnr + 1


    def clean_defintion(self,lst):
        res = []
        # drop first element
        # replace newline with colon
        # limit the number of defintions to 5
        upper_val = min(5, len(lst))
        for i in range(1,upper_val):
            str = lst[i]
            str = str.replace('\n', '  \n  ')
            res.append(str)
        return res


if __name__ == "__main__":
    pg = Page()
    pg.parse_all_files('/home/avare/repos/quizlet/data/html_files_05_12_2020/*.html')
    print(f"All Done **************** verb count is:  {pg.COUNTER}")

