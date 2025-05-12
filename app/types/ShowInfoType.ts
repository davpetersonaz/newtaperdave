
//app/types/ShowInfoType.ts
export type ShowInfo = {
	sources?: number;
	artist?: string;
	artist_sort?: string;
	artist_wide?: string;
	artist_wide_h?: number;
	artist_wide_w?: number;
	artist_square?: string;
	artist_square_h?: number;
	artist_square_w?: number;
	showdate?: string;
	venue?: string;
	venue_logo?: string;
	venue_logo_h?: number;
	venue_logo_w?: number;
	city?: string;
	city_state?: string;
	pcloudlink?: string;
	archivelink?: string;
	setlist?: string;
	samplefile?: string;
};

export interface ShowListItem extends ShowInfo {
	show_id: number;
	sourcetext: string;
}

export interface ShowLine {
    show_id: number;
    artist: string;
    showdate: string;
    venue: string;
    city: string;
    source_num: number;
    sourcetext: string;
    archivelink: JSX.Element;
    pcloudlink: JSX.Element;
    samplefile: JSX.Element;
}
