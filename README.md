Tumo Task
Description
A brief description of your project, outlining its main features and purpose.

Table of Contents
Installation
Configuration
Database Setup
Running the Application
Usage
API Endpoints
Contributing
License
Installation
Follow these steps to install and run the project on your local machine.

Clone the Repository
Open your terminal.

Navigate to the directory where you want to clone your project.
cd /path/to/your/directory

Clone the repository:

git clone
git clone git@github.com:AnMashinyan/tumo.git

Navigate into the cloned repository directory:
cd project-root

Configuration
Create the configuration files (database.ini and system.ini) in the configuration/ directory.

Create database.ini:
[default_connection]
HOST = localhost
NAME = your_database_name
USERNAME = your_database_user
PASSWORD = your_database_password
PORT = 3306
Create system.ini:
STATE = DEBUG
Ensure the MySQL database is set up and running with the credentials provided in the database.ini file.

Database Setup
Log in to your MySQL server:

mysql -u your_database_user -p
Create the necessary database and tables:
Insert initial data for countries and cities:

INSERT INTO countries (name) VALUES ('Country1'), ('Country2'), ('Country3');
INSERT INTO cities (name, country_id) VALUES ('City1', 1), ('City2', 1), ('City3', 2);

Running the Application
Start the Backend (PHP)
Navigate to the root directory of your project:

cd /path/to/your/project-root
Start the PHP server:

php -S localhost:8000

Set Up the Frontend (React)
Navigate to the frontend directory:

cd frontend
Install the dependencies:

npm install
Start the React application:

npm start

Open the Application in Your Browser
Open your browser and navigate to:
http://localhost:3000
