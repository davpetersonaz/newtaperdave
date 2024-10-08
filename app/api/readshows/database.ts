
import conn from '../../lib/db';

export async function addShow(showInfo:(string|number)[]){
	const keys = (Object.keys(showInfo)).join(", ");
	const query = `INSERT INTO shows (${keys}) 
					VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`;
//	console.warn('query', query);
	const values = (Object.values(showInfo));
//	console.warn('values', values);
	const result = await conn.query(query, values);
//	console.warn('result', result);
	return result;
}

export async function removeAllShows(){
	const query = "DELETE FROM shows";
	const result = await conn.query(query);
//	console.warn('result', result);
	return result;
}

export async function createCache(fetchXXX: () => (string)[]){
	const fetchArray = await fetchXXX();
//	console.warn('fetchArray', fetchArray);
	const query = `UPDATE query_cache
					SET result = $2
					WHERE query = $1`;
	const values = [ fetchXXX.name, JSON.stringify(fetchArray) ];
	const result = await conn.query(query, values);
	console.warn(fetchXXX.name);
}
