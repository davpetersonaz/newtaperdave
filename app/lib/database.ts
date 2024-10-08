
import conn from './db';

export async function getShowListAlpha(){
	const query = `SELECT s.show_id, s.artist, s.artist_wide, s.artist_wide_h, s.artist_wide_w, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.artist_sort ASC, s.showdate DESC`;
	const result = await conn.query(query);
	return result.rows;
}

export async function getShowListChrono(){
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.showdate DESC`;
	const result = await conn.query(query);
	return result.rows;
}

export async function getShowListCity(){
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.city, s.city_state, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.city_state ASC, s.showdate DESC`;
	const result = await conn.query(query);
	return result.rows;
}

export async function getShowListSource(){
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.sources ASC, s.showdate DESC`;
	const result = await conn.query(query);
	return result.rows;
}

export async function getShowListVenue(){
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.venue_logo, s.venue_logo_h, s.venue_logo_w, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.venue ASC, s.showdate DESC`;
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

export async function getFeaturedBands(){
	const query = `SELECT artist_square, COUNT(artist) AS artist_count
					FROM public.shows
					WHERE artist_square <> ''
					GROUP BY artist_square 
					HAVING COUNT(artist_square) > 2
					ORDER BY artist_count DESC`;
	const result = await conn.query(query);
	const namesOnly = [];
	await result.rows.map(x => namesOnly.push(x['artist_square']));
	console.warn('namesOnly', namesOnly, typeof namesOnly);
	return namesOnly;
}

export async function getQueryCache(querystring: string){
	const query = `SELECT result
					FROM query_cache
					WHERE query=$1`;
	const values = [ querystring ];
	const result = await conn.query(query, values);
//	console.warn('result.rows', typeof result.rows, result.rows);
//	console.warn('result.rows[0].result', typeof result.rows[0].result, result.rows[0].result);
	return (result.rows[0].result ? result.rows[0].result : '');
}