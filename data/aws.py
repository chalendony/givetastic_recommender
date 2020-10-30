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
    with open(file) as f:
        lines = list(line for line in (l.strip() for l in f) if line)
    return lines


def insert_labels(dat):
    query = (
        "INSERT INTO testing.test_label_sdg_campaign () "
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


def init_demo_labels(file):
    dat = readfile(file)
    insert_labels(dat)



if __name__ == "__main__":
    print("aws database test")
    get_aws_connection()
    df = get_labels()
    print(df.head())

    file = "goals_categories.csv"
    init_demo_labels(file)

    conn.close()


