"""
connect to datasource
"""

import os
import boto3
import mysql.connector

ENDPOINT = os.getenv('ENDPOINT')
port = os.getenv('PORT')
PORT=os.getenv('PORT')
USR=os.getenv('USR')
REGION=os.getenv('REGION')
DBNAME=os.getenv('DBNAME')

os.environ['LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN'] = '1'

#gets the credentials from .aws/credentials
session = boto3.Session(profile_name='default')
client = boto3.client('rds')

token = client.generate_db_auth_token(DBHostname=ENDPOINT, Port=PORT, DBUsername=USR, Region=REGION)

try:
    conn =  mysql.connector.connect(host=ENDPOINT, user=USR, passwd=token, port=PORT, database=DBNAME)
    cur = conn.cursor()
    cur.execute("""SELECT now()""")
    query_results = cur.fetchall()
    print(query_results)
except Exception as e:
    print("Database connection failed due to {}".format(e))