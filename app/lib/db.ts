
import { Pool } from "pg";
import 'dotenv/config';

let conn;
if(!conn){
	conn = new Pool({
		user: process.env.PGSQL_USER,
		host: process.env.PGSQL_HOST,
		database: process.env.PGSQL_DATABASE,
		password: process.env.PGSQL_PASSWORD,
		port: process.env.PGSQL_PORT,
	});
}

export default conn;