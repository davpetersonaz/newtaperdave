//app/api/readshows/database.ts
import conn, { doSelect } from '@/lib/db';
import { ShowInfo, ShowListItem } from '@/types/ShowInfoType';

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
