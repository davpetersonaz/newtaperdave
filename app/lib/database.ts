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
	console.info('namesOnly', namesOnly, typeof namesOnly);
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
        console.info('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

export async function addShow(show: ShowInfo):Promise<number> {
	const sourceId = show.sources !== undefined ? show.sources : OTHER; // Default to OTHER if undefined
	const query = `
		INSERT INTO shows (
			sources, artist, artist_sort, artist_wide, artist_wide_h, artist_wide_w,
			artist_square, artist_square_h, artist_square_w, showdate, venue,
			venue_logo, venue_logo_h, venue_logo_w, city, city_state,
			pcloudlink, archivelink, setlist, samplefile
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`;
//	console.info('query', query);
	const values = [
		sourceId,
		show.artist || '',
		show.artist_sort || '',
		show.artist_wide || '',
		show.artist_wide_h || 0,
		show.artist_wide_w || 0,
		show.artist_square || '',
		show.artist_square_h || 0,
		show.artist_square_w || 0,
		show.showdate || '',
		show.venue || '',
		show.venue_logo || '',
		show.venue_logo_h || 0,
		show.venue_logo_w || 0,
		show.city || '',
		show.city_state || '',
		show.pcloudlink || '',
		show.archivelink || '',
		show.setlist || '',
		show.samplefile || '',
	];

	console.info('addShow query:', query);
	console.info('addShow values:', values);
	const result = await conn.query(query, values);
//	console.info('result', result);
	return (result.rowCount ? result.rowCount : 0);
}

export async function removeAllShows(): Promise<void> {
	try {
		const query = `TRUNCATE TABLE shows RESTART IDENTITY`;
		const result = await conn.query(query);
		console.info('removeAllShows: Table truncated, rows affected:', result.rowCount);
	} catch (error) {
		console.error('Failed to remove all shows:', error);
		throw error;
	}
}

export async function createCache(fetchXXX:() => Promise<ShowInfo[]>, queryName:string): Promise<void> {
	try {
		const fetchArray = await fetchXXX();
		if (!Array.isArray(fetchArray)) {
			console.error(`Invalid fetchArray for ${queryName}:`, fetchArray);
			return;
		}
		const query = `
			INSERT INTO query_cache (query, result)
			VALUES ($1, $2)
			ON CONFLICT (query)
			DO UPDATE SET result = EXCLUDED.result
		`;
		const values = [queryName.toLowerCase(), JSON.stringify(fetchArray)];
		const result = await conn.query(query, values);
		if (result.rowCount !== null && result.rowCount > 0) {
			console.info(`Cached: ${queryName}, rows affected: ${result.rowCount}`);
		} else {
			console.warn(`No rows affected for ${queryName}`);
		}
	} catch (error) {
		console.error(`Failed to cache ${fetchXXX.name}:`, error);
	}
}

//these should be in the order i want them displayed on the "sort by source" page...
//NOTE: changing these requires a change to the database as well
export const GAP = 4;//Golden Age Project FC4s
export const AT853 = 5;//AudioTechnica 853s
export const MATRIX_WITH_GAP = 8;//SBD + Golden Age Projects
export const MATRIX_WITH_AT853 = 9;//SBD + AT853
export const MATRIX_WITH_H5 = 10;//SBD + ZoomH5
export const MATRIX_WITH_H6 = 11;//SBD + ZoomH6
export const MATRIX_WITH_H4 = 12;//SBD + ZoomH4n
export const SBD = 20;//Soundboard
export const MBHO = 25;//MBHO (patched into grout's rig)
export const OTHER = 29;//other (anything else will probably be better than the Zoom mics)
export const ZOOMH5 = 34;//ZoomH5
export const ZOOMH6 = 35;//ZoomH6
export const ZOOMH4 = 36;//ZoomH4n
