import os
import git
import glob
import subprocess
import  kubernetes
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from datetime import datetime, date
from BuildProject import build_project, run_command, update_branch_counter, execute_bash_script

from db_config import get_db_connection
from jinja2.lexer import TOKEN_DOT

logging.basicConfig(level=logging.DEBUG)

DemoBuilder = Flask(__name__)

CORS(DemoBuilder)

# Configuration for the repositories
REPOSITORIES = [
    {
        "name": "boilerplate-helm-charts",
        "repo_url": "git@github.com:Lynch0001/boilerplate-helm-charts.git",
        "base_branch": "main",
        "search_path": "boilerplate-helm-charts/archiver/values/demo/*",
        "script": "/app/boilerplate-helm-charts/buildDemoProject.sh",
        "repo_path": "boilerplate-helm-charts"
    },
    {
        "name": "boilerplate-infra-live",
        "repo_url": "git@github.com:Lynch0001/boilerplate-infra-live.git",
        "base_branch": "main",
        "search_path": "boilerplate-infra-live/prod/us-east-1/xib/xib-demo/*",
        "script": "/app/boilerplate-infra-live/buildInfraDemoProject.sh",
        "repo_path": "boilerplate-infra-live"
    },
]



@DemoBuilder.route('/add-requester-user', methods=['POST'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def add_requester_user():
    data = request.json
    segment = data.get('segment')
    name_first = data.get('name_first')
    name_last = data.get('name_last')
    phone = data.get('phone')
    email = data.get('email')
    cn = data.get('cn')

    if not (segment and name_last and name_first and phone and email and cn):
        return jsonify({"error": "Invalid input"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO requestor_user (segment, name_first, name_last, phone, email, cn) VALUES (%s, %s, %s, %s, %s, %s)",
                    (segment, name_first, name_last, phone, email, cn)
                )
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/list-requester-user', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_requester_user():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM requestor_user")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/delete-requester-user/<int:id>', methods=['DELETE'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def delete_requester_user(id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM requestor_user WHERE id = %s", (id,))
        return jsonify({"message": "Entry deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/add-admin-user', methods=['POST'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def add_admin_user():
    data = request.json
    name_first = data.get('name_first')
    name_last = data.get('name_last')
    phone = data.get('phone')
    email = data.get('email')
    cn = data.get('cn')

    if not (name_last and name_first and phone and email and cn):
        return jsonify({"error": "Invalid input"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO admin_user (name_first, name_last, phone, email, cn) VALUES (%s, %s, %s, %s, %s)",
                    (name_first, name_last, phone, email, cn)
                )
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/list-admin-user', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_admin_user():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM admin_user")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/delete-admin-user/<int:id>', methods=['DELETE'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def delete_admin_user(id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM admin_user WHERE id = %s", (id,))
        return jsonify({"message": "Entry deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/add-project-request', methods=['POST'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def add_project_request():
    data = request.json
    logging.debug(data)
    date_format = '%Y-%m-%d'
    segment = data.get('selected_segment')
    requestor = data.get('requestor')
    start_date = datetime.strptime(data.get('start_date'),date_format)
    end_date = datetime.strptime(data.get('end_date'),date_format)
    mq1_host = data.get('mq1_host')
    if data.get('mq1_port') == '':
        mq1_port = 0
    else:
        mq1_port = data.get('mq1_port')
    mq2_host = data.get('mq2_host')
    if data.get('mq2_port') == '':
        mq2_port = 0
    else:
        mq2_port = data.get('mq2_port')
    mq3_host = data.get('mq3_host')
    if data.get('mq3_port') == '':
        mq3_port = 0
    else:
        mq3_port = data.get('mq3_port')
    mq_flag = data.get('mq_flag')
    inbound_sftp_pw = data.get('producer_sftp_pw')
    inbound_sftp_key = data.get('producer_sftp_key')
    logging.debug(data)
    if not (segment and requestor and start_date and end_date ):
        return jsonify({"error": "Invalid input"}), 400
    current_date = datetime.now()
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO requested_project (segment, requestor, request_date, start_date, end_date, mq1_host, mq1_port, mq2_host, mq2_port, mq3_host, mq3_port, mq_flag, inbound_sftp_pw, inbound_sftp_key) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (segment, requestor, current_date, start_date, end_date, mq1_host, mq1_port, mq2_host, mq2_port, mq3_host, mq3_port, mq_flag, inbound_sftp_pw, inbound_sftp_key)
                )
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper
def get_project_request(id):
    # Get data from requested project
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM requested_project WHERE id = %s", (id,))
                row = cur.fetchone()
        return row
    except Exception as e:
        return jsonify({"error fetching request data": str(e)}), 500


@DemoBuilder.route('/list-project-request', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_project_request():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM requested_project")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/delete-project-request/<int:id>', methods=['DELETE'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def delete_project_request(id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM requested_project WHERE id = %s", (id,))
        return jsonify({"message": "Entry deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

##############################################################################


@DemoBuilder.route('/approve-project-request/<int:id>', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def approve_project_request(id):
    # Get data from requested project
    try:
        data = get_project_request(id)
        if data is not None: logging.debug("retrieved project request")
    except Exception as e:
        return jsonify({"error fetching request data": str(e)}), 500

    # set values
    id = data[0]
    segment = data[1]
    requestor = data[2]
    request_date = data[3]
    start_date = data[4]
    end_date = data[5]

    # Add to active project list
    project = find_unused_project()
    current_date = datetime.now()
    approver = "CN=Doe, Jane"
    deployed = False
    logging.debug(f"adding project {project} to active list")
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE requested_project SET approver = %s, approved_date = %s WHERE id = %s",
                    (approver, datetime.now(), id)
                )
            return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error writing active project data": str(e)}), 500

##############################################################################


@DemoBuilder.route('/build-project-request/<int:id>', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def build_project_request(id):
    # Get project_request
    logging.debug("building project request")
    try:
        project_request = get_project_request(id)
        if project_request is not None: logging.debug("retrieved project request")
    except Exception as e:
        return jsonify({"error fetching request data": str(e)}), 500

    if project_request[4] is not None:
        logging.debug("Verified project request is approved")
    else:
        logging.debug("Project request must be approved before building")

    # get project name
    project_name = find_unused_project()

    # build project (MANUAL OR CHRON)
    try:
        success = build_project(project_name, project_request, REPOSITORIES)
        if success:
            update_unused_project(project_name, True)
            return jsonify({"message": f"Successfully built project: {project_name}"}), 201
    except Exception as e:
        return jsonify({"error building project request": str(e)}), 500
    
##############################################################################
##############################################################################

def deploy_project(id):

    # deploy project (MANUAL OR CHRON)
    logging.debug("deploying project request")

    # update deployed status in active projects
    deployed = True
    try:
        update_project_deployed(project, True)
    except Exception as e:
        return jsonify({"error writing active project data": str(e)}), 500

    # delete project request
    try:
        delete_project_request(id)
        logging.debug("deleted project request")
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error deleting request data": str(e)}), 500



def destroy_project(id):
    logging.debug("destroying active project")
    # get project name from active projects
    project_name = get_active_project_name(id)
    # delete namespaces from cluster and terraform state from s3
    components = ["artemis", "kafka", "zookeeper", "ms", "mq"]
    # delete namespaces
    for component in components:
        try:
            v1 = client.CoreV1Api()
            namespace = project_name[0] + component
            v1.delete_namespaced_project(namespace)
        except Exception as e:
            return jsonify({"error deleting project namespace": str(e)}), 500
    # delete bucket state
    # TODO: bucket cleanup

##############################################################################
##############################################################################





@DemoBuilder.route('/add-active-project', methods=['POST'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def add_active_project(project):
    date_format = '%Y-%m-%d'
    segment = project.get('segment')
    requestor = project.get('requestor')
    request_date = project.get('request_date')
    start_date = project.get('start_date')
    end_date = project.get('end_date')
    current_date = datetime.now()
    approver = "CN=Doe, Jane"
    deployed = False
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO active_project (project, segment, requestor, approver, request_date, approved_date, start_date, end_date, deployed) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (project, segment, requestor, approver, request_date, current_date, start_date, end_date, deployed)
                )
            return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_active_project(id):
    # Get data from requested project
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM active_project WHERE id = %s", (id,))
                row = cur.fetchone()
        return row
    except Exception as e:
        return jsonify({"error fetching request data": str(e)}), 500

@DemoBuilder.route('/list-active-project', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_active_project():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM active_project")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/delete-active-project/<int:id>', methods=['DELETE'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def delete_active_project_(id):
    # get project name from active projects
    try:
        project = get_active_project(id)
        logging.debug(project)
        project_name = project[1]
        logging.debug(project_name)
        if project is not None: logging.debug("retrieved active project")
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # archive project
    add_archive_project(project)
    # delete from active projects
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM active_project WHERE id = %s", (id,))
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # update used project table
    try:
        update_unused_project(project_name, False)
        return jsonify({"message": "Entry deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#################################################################################

@DemoBuilder.route('/add-segment', methods=['POST'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def add_segment():
    data = request.json
    name = data.get('name')
    inbound_sftp = data.get('inbound_sftp')
    inbound_sftp_user = data.get('inbound_sftp_user')
    inbound_https = data.get('inbound_https')
    inbound_jms = data.get('inbound_jms')
    outbound_sftp = data.get('outbound_sftp')
    outbound_https = data.get('outbound_https')
    outbound_jms = data.get('outbound_jms')
    mq = data.get('mq')
    mq_hosts = data.get('mq_hosts')

    if not (name):
        return jsonify({"error": "Invalid input"}), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO segment (name, inbound_sftp, inbound_sftp_user, inbound_https, inbound_jms, outbound_sftp, outbound_https, outbound_jms, mq, mq_hosts) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (name, inbound_sftp, inbound_sftp_user, inbound_https, inbound_jms, outbound_sftp, outbound_https, outbound_jms, mq, mq_hosts)
                )
        return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/get-segments', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def get_segments():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT name FROM segment")
                segments = [''.join(tup) for tup in cur.fetchall()]
                #logging.debug(segments)
               # if segments != null: logging.debug("fetched segments successfully")
        return segments
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_segment(id):
    # Get data from requested project
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM segment WHERE id = %s", (id,))
                row = cur.fetchone()
        return row
    except Exception as e:
        return jsonify({"error fetching request data": str(e)}), 500


@DemoBuilder.route('/list-segment', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_segment():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM segment")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@DemoBuilder.route('/delete-segment/<int:id>', methods=['DELETE'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def delete_segment(id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM segment WHERE id = %s", (id,))
        return jsonify({"message": "Entry deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


##########################################################################
##########################################################################
##########################################################################
##########################################################################
##########################################################################
##########################################################################

def add_archive_project(project): # project is a tuple
    date_format = '%Y-%m-%d'
    logging.debug(type(project[5]))
    logging.debug(project[5].strftime('%Y-%m-%d'))
    project_name = project[1]
    logging.debug(project[5].strftime('%Y-%m-%d'))
    segment = project[2]
    requestor = project[3]
    approver = project[4]
    request_date = project[5]
    approve_date = project[6]
    start_date = project[7]
    end_date = project[8]
    delete_date = datetime.now()
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO archive_project (project, segment, requestor, approver, request_date, approve_date, start_date, end_date, delete_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (project_name, segment, requestor, approver, project[5], project[6], project[7], project[8], delete_date)
                )
            return jsonify({"message": "Data successfully stored"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

##########################################################################
##########################################################################
##########################################################################
##########################################################################
##########################################################################
##########################################################################

@DemoBuilder.route('/list-archive-project', methods=['GET'])
@cross_origin(origins='*',allow_headers=['Content-Type','Authorization'])
def list_archive_project():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT * FROM archive_project")
                rows = cur.fetchall()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#################################################################################

def get_active_project_name(id):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT project FROM active_project WHERE id = %s", id)
                project = cur.fetchone() # returns tuple
        return project[0]
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Helper - Find First Unused Project
def find_unused_project():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT project FROM project_used WHERE used = FALSE ORDER BY project")
                unused_project = cur.fetchone() # returns tuple
        return unused_project[0]
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper - update unused projects table
def update_unused_project(project, used):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE project_used SET used = %s WHERE project = %s", (used, project))
        logging.debug("projects used table updated successfully")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Helper - update project deployed state in active projects table
def update_project_deployed(project, deployed):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("UPDATE active_project SET deployed = %s WHERE project = %s", (deployed, project))
        logging.debug("projects deployment state updated successfully")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# venv env vars set in site-packages/_virtualenv.py

if __name__ == '__main__':
    run_command(f"git config --global user.name \"Builder\"")
    run_command(f"git config --global user.email \"xib-dev@bah.com\"")
    DemoBuilder.run(host="0.0.0.0", port=5001)
