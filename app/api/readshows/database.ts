
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
//	console.log('query', query);
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

	console.log('addShow query:', query);
	console.log('addShow values:', values);
	const result = await conn.query(query, values);
//	console.log('result', result);
	return (result.rowCount ? result.rowCount : 0);
}

export async function removeAllShows(): Promise<number> {
	const query = "DELETE FROM shows";
	const result = await conn.query(query);
//	console.log('result', result);
	return (result.rowCount ? result.rowCount : 0);
}

export async function createCache(fetchXXX: () => Promise<ShowInfo[]>): Promise<void> {
	const fetchArray = await fetchXXX();
//	console.log('fetchArray', fetchArray);
	const query = `UPDATE query_cache
					SET result = $2
					WHERE query = $1`;
	const values = [ fetchXXX.name, JSON.stringify(fetchArray) ];
	const result = await conn.query(query, values);
	console.log('cached:', fetchXXX.name);
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
