const Pool = require('pg').Pool;
require('dotenv').config();

const devConfig = { // for local testing
   user: process.env.PG_USER,
   password: process.env.PG_PASSWORD,
   host: process.env.PG_HOST,
   database: process.env.PG_DATABASE,
   port: process.env.PG_PORT
}

const proConfig = { 
   connectionString: process.env.DATABASE_URL, // heroku addon
   ssl: true
}

console.log(process.env.NODE_ENV);
const pool = new Pool(
   process.env.NODE_ENV === 'production' ? proConfig : devConfig
);

module.exports = pool;
// tutorial followed to deploy: https://www.youtube.com/watch?v=ZJxUOOND5_A
// login to Heroku database in terminal: heroku pg:psql -a hareandhounds