"""
connect to aws datasource
"""
from dotenv import load_dotenv
load_dotenv()

import os
import mysql.connector
import pandas as pd

ENDPOINT = os.getenv('ENDPOINT')
PORT=os.getenv('PORT')
USR=os.getenv('USR')
REGION=os.getenv('REGION')
DBNAME=os.getenv('DBNAME')
PASSWD = os.getenv('PASSWD')

conn = None
cur = None

schema = """
CREATE TABLE `test_label_sdg_campaign` (
  `LABEL_ID` INTEGER DEFAULT NULL,
  `DATA_SOURCE` INTEGER DEFAULT NULL,
  `CITY` varchar(100) DEFAULT NULL,
  `PROJECT_ID` varchar(100) DEFAULT NULL,
  `NGO_NAME` varchar(500) DEFAULT NULL,
  `PROJECT_TITLE` varchar(500) DEFAULT NULL,
  `PROJECT_URL` varchar(500) DEFAULT NULL,
  `SDG_1` INTEGER  DEFAULT NULL,
  `SDG_2` INTEGER DEFAULT NULL,
  `SDG_3` INTEGER  DEFAULT NULL,  
  `SDG_4` INTEGER DEFAULT NULL,
  `LABEL_STATUS` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


"""

def connect_aws():
    try:
        conn =  mysql.connector.connect(host=ENDPOINT, user=USR, passwd=PASSWD, port=PORT, database=DBNAME)
        cur = conn.cursor()
        cur.execute("""SELECT now()""")
        query_results = cur.fetchall()
        print(query_results)
    except Exception as e:
        print("Database connection failed due to {}".format(e))

    cur.close()

def get_aws_connection():

    try:
        global conn
        conn =  mysql.connector.connect(host=ENDPOINT, user=USR, passwd=PASSWD, port=PORT, database=DBNAME)

        global cur
        cur = conn.cursor()
    except Exception as e:
        print("Database connection failed due to {}".format(e))


def get_labels():
    try:
        query = """
        SELECT * FROM testing.test_label_sdg_campaign
        """
        df = pd.read_sql(query, con=conn)
    except Exception as e:
        print("Database connection failed due to {}".format(e))

    return df


def readfile(filename):
    lines = None
    with open(filename) as f:
        lines = list(line for line in (l.strip() for l in f) if line)
    return lines


def insert_raw_labels(dat):
    query = (
        "INSERT INTO testing.test_raw_goal_project () "
        "VALUES (%s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s, %s)")
    for i in dat:
        print(i)
        splits = i.split('@')
        lst = []
        for j in splits:
            clean = j.strip()
            lst.append(clean)
        lst.insert(1, "BTP")
        tup = tuple(lst)
        cur.execute(query, tup)
    conn.commit()


def normalize_labels():
    goals = ['SDG_1', 'SDG_2', 'SDG_3']
    cur_A = conn.cursor(buffered=True)
    cur_B = conn.cursor(buffered=True)

    weight = 1.0

    query_insert = (
        "INSERT INTO testing.test_goal_project () "
        "VALUES (%s, %s, %s )")

    for g in goals:
        query_select = f"select PROJECT_ID , {g}  as goal from  testing.test_raw_goal_project trg where {g} != 0;"
        print(query_select)
        cur_A.execute(query_select)
        for (PROJECT_ID, goal) in cur_A:
            cur_B.execute(query_insert, (PROJECT_ID, goal, weight))
            conn.commit()





def init_demo_labels(file):
    """
    get_aws_connection()
    file = "goals_categories.csv"
    init_demo_labels(file)

    :param file:
    :return:
    """
    dat = readfile(file)
    insert_raw_labels(dat)

def get_projects(user_id):
    query = """
    select goal from test_image_goal tig
    where image_id IN (select image  from test_user_image tui where user_id = 1) 
    ;
    """
    pass






if __name__ == "__main__":
    print("aws database test")
    get_aws_connection()
    normalize_labels()


    conn.close()


