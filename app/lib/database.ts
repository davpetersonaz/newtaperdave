//app/lib/database.ts
import conn, { doSelect } from '@/lib/db';
import { ShowInfo, ShowListItem } from '@/types/ShowInfoType';

export async function getShowListAlpha():Promise<ShowListItem[]> {
	const query = `SELECT s.show_id, s.artist, s.artist_wide, s.artist_wide_h, s.artist_wide_w, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.artist_sort ASC, s.showdate DESC`;
	const rows = await doSelect<ShowListItem>(query);
	return rows;
}

export async function getShowListChrono():Promise<ShowListItem[]> {
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.showdate DESC`;
	const rows = await doSelect<ShowListItem>(query);
	return rows;
}

export async function getShowListCity():Promise<ShowListItem[]> {
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.city, s.city_state, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.city_state ASC, s.showdate DESC`;
	const rows = await doSelect<ShowListItem>(query);
	return rows;
}

export async function getShowListSource():Promise<ShowListItem[]> {
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.sources ASC, s.showdate DESC`;
	const rows = await doSelect<ShowListItem>(query);
	return rows;
}

export async function getShowListVenue():Promise<ShowListItem[]> {
	const query = `SELECT s.show_id, s.artist, s.showdate, s.venue, s.venue_logo, s.venue_logo_h, s.venue_logo_w, s.sources, s.archivelink, s.pcloudlink, s.samplefile, t.sourcetext 
					FROM shows s 
					LEFT JOIN sources t ON (t.id=s.sources) 
					ORDER BY s.venue ASC, s.showdate DESC`;
	const rows = await doSelect<ShowListItem>(query);
	return rows;
}

export async function getSourceInfo(source:number):Promise<string> {
	const query = "SELECT sourcetext FROM sources WHERE id=($1)";
	const values = [source];
	const rows = await doSelect<{ sourcetext:string }>(query, values);
	return (rows.length > 0 ? rows[0].sourcetext : '');
}

export async function getAllSources():Promise<{ id:number; sourcetext:string }[]> {
	const query = "SELECT id, sourcetext FROM sources";
	const rows = await doSelect<{ id:number; sourcetext:string }>(query);
	return rows;
}

export async function getShow(artist:string, showdate:string, source:string):Promise<ShowInfo | null> {
	const query = `SELECT json_agg(shows) AS show_info
					FROM shows 
					WHERE artist=$1 AND showdate=$2 AND sources=$3`;
	const values = [ artist, showdate, source ];
	const rows = await doSelect<{ show_info: ShowInfo[] }>(query, values);
	return (rows.length > 0 && rows[0].show_info.length > 0 ? rows[0].show_info[0] : null);
}

export async function getFeaturedBands():Promise<string[]>{
	const query = `SELECT artist_square, COUNT(artist) AS artist_count
					FROM public.shows
					WHERE artist_square <> ''
					GROUP BY artist_square 
					HAVING COUNT(artist_square) > 2
					ORDER BY artist_count DESC`;
	const rows = await doSelect<{ artist_square:string; artist_count:number }>(query);
	const namesOnly:string[] = rows.map(x => x.artist_square);
	console.warn('namesOnly', namesOnly, typeof namesOnly);
	return namesOnly;
}

export async function getQueryCache(querystring: string): Promise<string> {
  const query = `SELECT result FROM query_cache WHERE query=$1`;
  const values = [querystring.toLowerCase()];
  const rows = await doSelect<{ result: string }>(query, values);
  return rows.length > 0 ? rows[0].result : '';
}

export async function checkConnection(): Promise<void> {
    try {
        await conn.query('SELECT 1');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}
