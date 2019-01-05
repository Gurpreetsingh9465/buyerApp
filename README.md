# buyerApp

## Installation Instructions


#### Installation
1. Install Node.js and python
    * [Install Node.js](https://nodejs.org)
    * [Install Python 3.6](https://www.python.org/)

2. Verify Installation (open Terminal/CMD)
```
node -v
npm -v
python -v
```

3. Install Postgrsql [Install Postgresql](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) **Important** *note the username and password used while installing postgresql.* ***prefered username=postgres password = root***
* Setup postgres database (open terminal/CMD)
    * Go to The installation path ```cd C:\Program Files\PostgreSQL\11\bin```
    * login as user postgres by running ```psql.exe -U postgres``` and type the commands below:

        ```
        CREATE DATABASE buyer;
        CREATE USER admin WITH PASSWORD 'root';
        ALTER ROLE admin SET client_encoding TO 'utf8';
        ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
        ALTER ROLE admin SET timezone TO 'UTC';
        ALTER USER admin CREATEDB;
        ```

    * Exit psql by typing in \q and hitting enter.

4. open terminal/CMD with desired location and type the following commands

5. Get the source code on to your machine via git.

    ```
    https://github.com/Gurpreetsingh9465/buyerApp.git && cd buyerApp
    ```

6. Rename `sample.env` as `.env`.

    ```
    mv sample.env .env
    ```
 
 7. Change the contents of `.env` file
    ```
      DATABASE_NAME = buyer
      DATABASE_USER_NAME = postgres
      USER_PASSWORD = root
      HOST = localhost
      DATABASE_PORT = 5432
      API_HOST = http://localhost:3000
      EMAIL_ID = youremail@gmail.com
      EMAIL_PASSWORD = ************
      SECRET_KEY = df^009dg03s%)@2@0vw-$b96ray=rk2%#@epf0+c2&zkgbmg^0
    ```
    
8. Go To [google Security](https://myaccount.google.com/security)
      * Disable 2 step verification
      * Genrate App specific Password
      * Select Desktop While Creating App Password
      * Copy the app Password And Change Your .env File and paste the Password and gmailId
    ```
      EMAIL_ID = youremail@gmail.com
      EMAIL_PASSWORD = ************
    ```

9. create virtual environment
   * For pip users
   ```
      sudo apt-get install python-pip python-dev python-virtualenv
      virtualenv --system-site-packages ~/dzone --python=python3.6
      source ~/dzone/bin/activate
   ```
   * For Anaconda users
   ```
      conda create -n dzone python=3.6 anaconda
      source activate dzone
      or
      activate dzone
   ```

10. Install Packages (open terminal/CMD with location ```desired/location/buyerApp```)
   * install All packages like react express django etc.. (you can use pip / conda)
   * make sure your virtual environment is activated
   ```
      pip install -r requirements.txt
      npm install
   ```

11. `npm run watch`

12. open another terminal and run 
      * `python manage.py makemigrations`
      * `python mange.py migrate`
      * `python mange.py runserver 0.0.0.0:3000`
   
13. Open Your Browser And go to `localhost:3000`
