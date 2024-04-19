# First NC Project

Link to hosted version: https://first-nc-project.onrender.com/

Summary of project: To build an API for the purpose of accessing application data programmatically, mimicing a real world backend service (such as Reddit) that provides this information to the front end architecture.

The database is PSQL and is interacted with using node-postgres.

Instructions:
1) Clone repo- npm clone https://github.com/kam123hk/first-nc-project.git
2) Install dependencies- npm install
3) Drop / Create databases- npm run setup-dbs
4) Seed test database / Runs tests - npm run test
5) Seed dev database- npm run seed
6) Create .env.test PGDATABASE=your_test_db and .env.development PGDATABASE=your_dev_db to connect to the two databases locally.

Minimum versions:
Node.js 14.0.0
Postgres 8.7.3