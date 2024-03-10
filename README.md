INSTRUCTIONS

1. <b>TESTS</b>
2. <b>Database</b>
3. <b>Node/Express & env</b>

<b>TESTS</b>

For tests, run each folder individually, not the entire tests folder, as it will cause errors. (e.g. "npm test ./__tests__/AUTH" instead of "npm test ./__tests__" 

<b>DATABASE</b>

To run the api, first of all you will need PostgreSQL installed on your computer. We recommend version 16.

During the installation you will be required to set a password for the 'postgres' user. We recommend to use the password 'root'.

After you've installed PostgreSQL, restart the computer. 

Now you will need to create a database before importing the sql file.

Log in the psql with the command: "<b>psql -U postgres</b>" and with the password you've set during the installation.

After logging in, use the "CREATE DATABASE <database_name>". Replace database_name with whatever you'd like.

After creating the database, use "\q" to quit the psql.

Try to import the sql file with the command "<b>psql -U <username> -d <database_name> -f <path_to_sql_file></b>" in the command-line.

Replace <username> with postgres, database_name with the database_name you've just created, and, at last, the path to the sql file.


<b>NODE/EXPRESS & ENV</b>

Open a command-line in the folder with the app.js, run the command "<b>npm i</b>" to install the necessary modules for the API.

After that, create a .env file with the next structure:
    EMAIL_USER=
    PASSWORD=
    JWT_KEY=''
    PORT = 8081
    db_name = ''
    db_username = ''
    db_password = ''
    db_host ='localhost'
    db_dialect = 'postgres'

The "EMAIL_USER" and "PASSWORD" are for the node mailer(account activation and password reset). Unfortunately, you will have to contact us for the credentials if you don't have a gmail that can handle it.

JWT_KEY is the secret key for generating Json Web Tokens.