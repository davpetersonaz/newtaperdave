
//app/showlist/components/ShowList.tsx
import { ShowListItem, ShowLine } from '@/types/ShowInfoType';
import { strip } from '../../lib/util';
import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileArrowDown, faFileZipper, faPlay } from '@fortawesome/free-solid-svg-icons';
import { getQueryCache } from '@/lib/database';
import { imageSize } from 'image-size';
import path from 'path';
import { promises as fs } from 'fs';

export async function generateShowList(getShowList:() => Promise<ShowListItem[]>, groupByKey:keyof ShowListItem | 'year', cacheName:string):Promise<JSX.Element[]> {
    const cached = await getQueryCache(cacheName);
    const showlist:ShowListItem[] = (cached === '' ? await getShowList() : JSON.parse(cached) as ShowListItem[]);
    console.warn('showlist', showlist.length);

    const output:JSX.Element[] = [];
    output.push(
        <div key="header">
            <p className="text-4xl font-bold pb-8">Shows I Have Taped</p>
        </div>
    );

    let currentGroup = 'unset';
    let currentGroupHeader:JSX.Element = <p className="text-3xl font-bold">{currentGroup}</p>;
    let shows:ShowLine[] = [];

    for (const show of showlist) {
        let groupValue:string;
        if(groupByKey === 'year'){
            const date = new Date(show.showdate || '');
            groupValue = date.getFullYear().toString();
        }else{
            const value = show[groupByKey];
            groupValue = (value !== undefined ? String(value) : 'unset');
        }

        if (groupValue !== currentGroup) {
            if (shows.length) {
                output.push(
                    <div id={strip(currentGroup)} key={currentGroup}>
                        <div className="pb-4">
                            {currentGroupHeader}
                        </div>
                        <ul className="pb-8">
                            {shows.map((line) => (
                                <li key={line.show_id}>
                                    <Link href={`/showinfo/${line.artist}/${line.showdate}/${line.source_num}`}>
                                        <span className="text-1xl font-bold">{line.artist}</span> - {line.showdate} - {line.venue} - {line.sourcetext}
                                    </Link>
                                    {line.pcloudlink} {line.archivelink} {line.samplefile}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            }
            currentGroup = String(groupValue);
            shows = [];

            // Set the group header
            if(groupByKey === 'year'){
                currentGroupHeader = <p className="text-3xl font-bold">{currentGroup}</p>;
            }else{
                const { url:imageUrl, width:imageWidth, height:imageHeight } = await getImageInfo(show, groupByKey);
                if (imageUrl && imageUrl !== '') {
                    currentGroupHeader = (
                        <Image
                            src={imageUrl}
                            alt={currentGroup}
                            height={imageHeight || 100} // Default to 100 if not provided
                            width={imageWidth || 100}  // Default to 100 if not provided
                            className="mx-auto border-2 border-black"
                        />
                    );
                } else {
                    currentGroupHeader = <p className="text-3xl font-bold">{currentGroup}</p>;
                }
            }
        }
        const line:ShowLine = {
            show_id: show.show_id,
            artist: show.artist || '',
            showdate: show.showdate || '',
            venue: show.venue || '',
            city: show.city || '',
            source_num: show.sources || 0,
            sourcetext: show.sourcetext || '',
            archivelink: show.archivelink && show.archivelink !== ''
				? ( <Link href={show.archivelink} target="_blank"> <FontAwesomeIcon icon={faFileZipper} /> </Link> )
				: ( <></> ),
            pcloudlink: show.pcloudlink && show.pcloudlink !== ''
				? ( <Link href={show.pcloudlink} target="_blank"> <FontAwesomeIcon icon={faFileArrowDown} /> </Link> )
				: ( <></> ),
            samplefile: show.samplefile && show.samplefile !== '' && show.artist && show.showdate && show.sources !== undefined
				? ( <Link href={`/showinfo/${encodeURIComponent(show.artist)}/${encodeURIComponent(show.showdate)}/${encodeURIComponent(show.sources.toString())}`} target="_blank">
                        <FontAwesomeIcon icon={faPlay} />
                    </Link> )
				: ( <></> )
        };
        shows.push(line);
    }

    // Handle the last group
    if (shows.length) {
        output.push(
            <div id={strip(currentGroup)} key={currentGroup}>
                <div className="pb-4">
                    {currentGroupHeader}
                </div>
                <ul className="pb-8">
                    {shows.map((line) => (
                        <li key={line.show_id}>
                            <Link href={`/showinfo/${line.artist}/${line.showdate}/${line.source_num}`}>
                                <span className="text-1xl font-bold">{line.artist}</span> - {line.showdate} - {line.venue} - {line.sourcetext}
                            </Link>
                            {line.pcloudlink} {line.archivelink} {line.samplefile}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return output;
}

// Helper function to get the image URL and dimensions
async function getImageInfo(show:ShowListItem, groupByKey:keyof ShowListItem):Promise<{ url:string|undefined; width:number|undefined; height:number|undefined }> {
    console.log('getImageInfo:', groupByKey, show);
    let url:string|undefined;
    let width:number|undefined;
    let height:number|undefined;

    switch (groupByKey) {
        case 'venue':
            url = show.venue_logo;
            width = show.venue_logo_w;
            height = show.venue_logo_h;
            break;
        case 'artist':
            url = show.artist_wide;
            width = show.artist_wide_w;
            height = show.artist_wide_h;
            break;
        case 'city_state':
            const filename = (show.city ? show.city.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')+'.jpg' : undefined);
            console.log('filename:', filename);
            if (filename) {
                // Construct the full file path to the image
                const imagePath = path.join(process.cwd(), 'public', 'images', 'cities', filename);
                // Construct the URL for the Image component
                url = `/images/cities/${filename}`;
                try {
                    // Check if the file exists
                    await fs.access(imagePath);
                    // Get dimensions using image-size
                    const dimensions = imageSize(imagePath);
                    width = dimensions.width;
                    height = dimensions.height;
                } catch (error) {
                    // If the file doesn't exist, return undefined for URL and dimensions
                    url = undefined;
                    width = undefined;
                    height = undefined;
                }
            }
            break;
        default:
            url = undefined;
            width = undefined;
            height = undefined;
    }

    return { url, width, height };
}

// Helper function to get the image URL
function getImageUrl(show: ShowListItem, groupByKey: keyof ShowListItem): string | undefined {
    switch (groupByKey) {
        case 'venue':
            return show.venue_logo;
        case 'artist':
            return show.artist_wide;
        default:
            return undefined;
    }
}

// Helper function to get the image height
function getImageHeight(show: ShowListItem, groupByKey: keyof ShowListItem): number | undefined {
    switch (groupByKey) {
        case 'venue':
            return show.venue_logo_h;
        case 'artist':
            return show.artist_wide_h;
        default:
            return undefined;
    }
}

// Helper function to get the image width
function getImageWidth(show: ShowListItem, groupByKey: keyof ShowListItem): number | undefined {
    switch (groupByKey) {
        case 'venue':
            return show.venue_logo_w;
        case 'artist':
            return show.artist_wide_w;
        default:
            return undefined;
    }
}
