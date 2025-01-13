import os
import git
import glob
import logging
import subprocess
from datetime import datetime


logging.basicConfig(level=logging.DEBUG)

# Helper Functions

def run_command(command, cwd=None):
    """Executes a shell command and returns its output."""
    result = subprocess.run(command, cwd=cwd, text=True, shell=True, capture_output=True)
    #logging.debug(f"process results: {result}")
    if result.returncode != 0:
        raise Exception(f"Error running command: {command}\n{result.stderr}")
    return result.stdout.strip()


def update_branch_counter():

    BRANCH_COUNTER_FILE = "./branch_counter.txt"  # Persistent counter file for branch incrementing

    """Increments the branch counter and resets the value daily."""
    today = datetime.now().strftime("%Y%m%d")
    if os.path.exists(BRANCH_COUNTER_FILE):
        with open(BRANCH_COUNTER_FILE, "r") as f:
            data = f.read().strip().split()
            stored_date, counter = data[0], int(data[1])
            if stored_date == today:
                counter += 1
            else:
                counter = 1  # Reset counter for the new day
    else:
        counter = 1  # Initialize counter if file doesn't exist

    # Write the updated counter to the file
    with open(BRANCH_COUNTER_FILE, "w") as f:
        f.write(f"{today} {counter}")

    return counter


def execute_bash_script(script_path, argument):
    """Runs a bash script with the provided argument."""
    logging.debug(f"Running script {script_path} with argument: {argument}")
    run_command(f"{script_path} {argument}")


# Main Function
def build_project(project_name, project_request, REPOSITORIES):

    today = datetime.now().strftime("%Y%m%d")  # Get the current date

    for repo in REPOSITORIES:
        repo_name = repo["name"]
        repo_url = repo["repo_url"]
        base_branch = repo["base_branch"]
        script_path = repo["script"]
        repo_dir = repo["repo_path"]

        branch_index = update_branch_counter()  # Increment and reset branch index if needed

        # Clone or update the repository
        if not os.path.exists(repo_dir):
            logging.debug(f"Cloning repository {repo_url}...")
            repo_data = git.Repo.clone_from(
                repo_url.replace("https://", "https://"),
                repo_dir
            )
        else:
            logging.debug(f"Repository already cloned in {repo_dir}.")
            repo_data = git.Repo(repo_dir)

        # Checkout the base branch
        logging.debug(f"Checking out the base branch '{base_branch}'...")
        repo_data.git.checkout(base_branch)

        # Create and switch to a new branch
        branch_name = f"{repo_name}-{today}-{branch_index}"  # Format branch name as date-index

        # Create and checkout a new branch
        if branch_name not in repo_data.heads:
            logging.debug(f"Creating and checking out new branch '{branch_name}'...")
            repo_data.git.checkout("-b", branch_name)
        else:
            logging.debug(f"Branch '{branch_name}' already exists. Checking out...")
            repo_data.git.checkout(branch_name)

        # Execute the bash script and create project files for commit
        if project_name:
            execute_bash_script(script_path, project_name)
        else:
            execute_bash_script(script_path, "")  # TODO: db config wont have new project

        # Check for changes
        logging.debug("Checking for changes...")
        if repo_data.is_dirty(untracked_files=True):
            logging.debug("Changes detected.")
            # Stage changes
            logging.debug("Staging changes...")
            repo_data.git.add(all=True)

            # Commit changes
            commit_message = f"Automated: {repo_name}"
            if project_name:
                commit_message += f" -> project: {project_name}"
            logging.debug(f"Committing changes with message: '{commit_message}'")
            repo_data.git.commit("-m", commit_message)

            # Push changes
            logging.debug(f"Pushing changes to branch '{branch_name}'...")
            repo_data.git.push("origin", branch_name)

            # Cleanup
            logging.debug(f"Cleaning up repo {repo_dir}")
            run_command(f"rm -rf {repo_dir}")

        else:
            logging.debug("No changes to commit.")
            raise Exception("No changes to commit.")

    return True