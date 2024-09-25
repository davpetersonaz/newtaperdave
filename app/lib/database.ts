
import conn from './db';

export async function getShowListAlpha(){
	const query = "SELECT show_id, artist, artist_wide, artist_wide_h, artist_wide_w, showdate, venue, sources, archivelink, pcloudlink, samplefile FROM shows ORDER BY artist_sort ASC";
	const result = await conn.query(query);
	return result.rows;
}

export async function getShowListChrono(){
	const query = "SELECT show_id, artist, artist_wide, artist_wide_h, artist_wide_w, showdate, venue, sources, archivelink, pcloudlink, samplefile FROM shows ORDER BY showdate DESC";
	const result = await conn.query(query);
	return result.rows;
}

export async function getSourceInfo(source:int):string{
	const query = "SELECT sourcetext FROM sources WHERE id=($1)";
	const values = [];
	values.push(source);
	const result = await conn.query(query, values);
	return (result.rows.length > 0 ? result.rows[0].sourcetext : '');
}

export async function getAllSources(){
	const query = "SELECT id, sourcetext FROM sources";
	const result = await conn.query(query);
	return result.rows;
}

export async function getShow(artist:string, showdate:string, source:string){
	const query = `SELECT json_agg(shows)
					FROM shows 
					WHERE artist=$1 AND showdate=$2 AND sources=$3`;
	const values = [ artist, showdate, source ];
//	console.warn('values', values);
	const result = await conn.query(query, values);
//	console.warn('getShow result.rows', result.rows);
//	console.warn('getShow result.rows[0]', result.rows[0]);
//	console.warn('getShow result.rows[0].json_agg', result.rows[0].json_agg);
	return (result.rows.length > 0 ? result.rows[0].json_agg[0] : '');
}
