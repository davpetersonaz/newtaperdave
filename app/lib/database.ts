
import conn from './db';

export async function getShowListAlpha(){
	const query = "SELECT artist, artist_wide, showdate, venue, sources, archivelink, pcloudlink, samplefile FROM shows ORDER BY artist_sort ASC";
	const result = await conn.query(query);
	return result;
}