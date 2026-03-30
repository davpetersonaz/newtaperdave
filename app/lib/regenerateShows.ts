// app/lib/regenerateShows.ts
import fsp from 'fs/promises';
import sizeOf from 'image-size';
import path from 'path';

import { ShowInfo } from '@/types/ShowInfoType';

import { 
    addShow, createCache, getShowListAlpha, getShowListChrono, getShowListCity, 
    getShowListSource, getShowListVenue, removeAllShows
} from './database';
import { 
    AT853, GAP, MATRIX_WITH_AT853, MATRIX_WITH_GAP, MATRIX_WITH_H4, MATRIX_WITH_H5, 
    MATRIX_WITH_H6, MBHO, OTHER, SBD, ZOOMH4, ZOOMH5, ZOOMH6
} from './database';
import { strip } from './util';

const PATH                   = path.join(process.cwd(), 'public/files/');
const ARTIST_SQUARE_IMG_PATH = path.join(process.cwd(), 'public/images/artists/square/');
const ARTIST_WIDE_IMG_PATH   = path.join(process.cwd(), 'public/images/artists/wide/');
const MP3_PATH               = path.join(process.cwd(), 'public/music/');
const VENUE_IMG_PATH         = path.join(process.cwd(), 'public/images/venues/');

const MISSING_ARCHIVE: string[] = [];
const MISSING_ARTIST_SQUARE_IMG: string[] = [];
const MISSING_ARTIST_WIDE_IMG: string[] = [];
const MISSING_PCLOUD: string[] = [];
const MISSING_SAMPLES: string[] = [];
const MISSING_VENUE_IMG: string[] = [];
const UNKNOWN_SOURCE: string[] = [];

export async function regenerateShows() {
    console.info('Starting full regeneration at:', new Date());
    try {
        const filenames = await getFilenames();
        console.info(`Found ${filenames.length} show files`);

        await removeAllShows();

        let imported = 0;
        for (const filename of filenames) {
            console.info(`Importing: ${filename}`);
            const fileContents = await readFile(filename);
            if (fileContents.length === 0) continue;
            const showInfo = await parseShowFile(fileContents, filename);
            if (!showInfo.artist || !showInfo.showdate || !showInfo.venue || !showInfo.city) {
                console.warn(`Skipping incomplete show: ${filename}`);
                continue;
            }
            await addShow(showInfo);
            imported++;
        }

        // Create all caches
        await Promise.all([
            createCache(getShowListAlpha, 'getShowListAlpha'),
            createCache(getShowListChrono, 'getShowListChrono'),
            createCache(getShowListCity, 'getShowListCity'),
            createCache(getShowListSource, 'getShowListSource'),
            createCache(getShowListVenue, 'getShowListVenue'),
        ]);

        console.info(`✅ Regeneration completed successfully! Imported ${imported} shows.`);
        return { success: true, imported };
    } catch (error) {
        console.error('❌ Regeneration failed:', error);
        throw error;
    }
}

// ==================== Core Parsing ====================

async function parseShowFile(fileContents: string[], filename: string): Promise<ShowInfo> {
    const showInfo: ShowInfo = {};

    // Artist
    const artistLine = fileContents.shift();
    if (artistLine) {
        showInfo.artist = artistLine.trim();
        showInfo.artist_sort = getArtistSort(showInfo.artist);
    }

    showInfo.sources = getSource(fileContents, filename);
    const artist_images = await getArtistImages(showInfo.artist || '');
    Object.assign(showInfo, artist_images);

    // Show date
    const dateLine = fileContents.shift();
    if (dateLine) {
        const { showdate } = getShowDate(dateLine.trim());
        showInfo.showdate = showdate;
    }

    // Venue
    const venueLine = fileContents.shift();
    if (venueLine) {
        const venue = await getVenue(venueLine.trim(), `${showInfo.artist} :: ${showInfo.showdate}`);
        showInfo.venue = venue.name;
        showInfo.venue_logo = venue.image;
        showInfo.venue_logo_h = venue.height;
        showInfo.venue_logo_w = venue.width;
    }

    // City
    const cityLine = fileContents.shift();
    if (cityLine) {
        const { city, city_state } = getCity(cityLine.trim());
        showInfo.city = city;
        showInfo.city_state = city_state;
    }

    // Links
    const { pcloud, archive } = getLinks(fileContents, `${showInfo.artist} :: ${showInfo.showdate}`);
    showInfo.pcloudlink = pcloud;
    showInfo.archivelink = archive;

    // Setlist + remaining lines
    showInfo.setlist = JSON.stringify(getTheRest(fileContents));

    // Sample file
    showInfo.samplefile = await getSampleFile(
        showInfo.artist || '', 
        showInfo.showdate || '', 
        ''
    );

    return showInfo;
}

// ==================== Helper Functions ====================

async function getFilenames(): Promise<string[]> {
    try {
        const files = await fsp.readdir(PATH);
        return files.filter(f => f.endsWith('.txt') || f.endsWith('.TXT'));
    } catch (error) {
        console.error('Error reading files directory:', error);
        return [];
    }
}

async function readFile(filename: string): Promise<string[]> {
    const fullPath = path.join(PATH, filename);
    try {
        const content = await fsp.readFile(fullPath, 'utf-8');
        return content.split(/\r?\n/);
    } catch (error) {
        console.error(`Error reading file ${fullPath}:`, error);
        return [];
    }
}

function getSource(fileContents: string[], filename: string): number {
    const sourceLine = fileContents.find((line) => line.includes("source: "));
    let source = OTHER;
    if (sourceLine) {
        const sourceLower = sourceLine.toLowerCase();
        if (sourceLower.includes('sbd + at853')) source = MATRIX_WITH_AT853;
        else if (sourceLower.includes('sbd + zoomh4')) source = MATRIX_WITH_H4;
        else if (sourceLower.includes('sbd + zoomh5')) source = MATRIX_WITH_H5;
        else if (sourceLower.includes('sbd + zoomh6')) source = MATRIX_WITH_H6;
        else if (sourceLower.includes('sbd + golden age')) source = MATRIX_WITH_GAP;
        else if (sourceLower.includes('sbd')) source = SBD;
        else if (sourceLower.includes('at853')) source = AT853;
        else if (sourceLower.includes('golden age')) source = GAP;
        else if (sourceLower.includes('zoomh4')) source = ZOOMH4;
        else if (sourceLower.includes('zoomh5')) source = ZOOMH5;
        else if (sourceLower.includes('zoomh6')) source = ZOOMH6;
        else if (sourceLower.includes('mbho')) source = MBHO;
        else {
            console.warn("ERROR: unknown source", filename);
            UNKNOWN_SOURCE.push(`${filename} :: ${sourceLine}`);
        }
    } else {
        console.warn("ERROR: no source field", filename);
        UNKNOWN_SOURCE.push(`${filename} :: >no source<`);
    }
    return source;
}

function getArtistSort(line: string): string {
    let result = line;
    if (line.substring(0, 4).toLowerCase() === 'the ') {
        result = line.substring(4) + ', The';
    } else if (line.substring(0, 2).toLowerCase() === 'a ') {
        result = line.substring(2) + ', A';
    } else if (line.substring(0, 3).toLowerCase() === 'an ') {
        result = line.substring(3) + ', An';
    }
    return result;
}

async function getArtistImages(artist: string) {
    const result = {
        artist_wide: '', artist_wide_h: 0, artist_wide_w: 0,
        artist_square: '', artist_square_h: 0, artist_square_w: 0,
    };

    let wip = artist;
    if (wip.startsWith('The ')) wip = wip.substring(4) + 'The';
    wip = strip(wip) + 'Logo';

    // Square
    try {
        const files = (await fsp.readdir(ARTIST_SQUARE_IMG_PATH)).filter(fn => fn.startsWith(wip));
        if (files.length > 0) {
            const fullPath = path.join(ARTIST_SQUARE_IMG_PATH, files[0]);
            const dim = sizeOf(fullPath);
            result.artist_square = `/images/artists/square/${files[0]}`;
            result.artist_square_h = dim.height!;
            result.artist_square_w = dim.width!;
        }
    } catch (error) {
        console.error(`Error loading square image for ${artist}:`, error);
        MISSING_ARTIST_SQUARE_IMG.push(`${artist} :: ${wip}`);
    }

    // Wide
    try {
        const files = (await fsp.readdir(ARTIST_WIDE_IMG_PATH)).filter(fn => fn.startsWith(wip));
        if (files.length > 0) {
            const fullPath = path.join(ARTIST_WIDE_IMG_PATH, files[0]);
            const dim = sizeOf(fullPath);
            result.artist_wide = `/images/artists/wide/${files[0]}`;
            result.artist_wide_h = dim.height!;
            result.artist_wide_w = dim.width!;
        }
    } catch (error) {
        console.error(`Error loading wide image for ${artist}:`, error);
        MISSING_ARTIST_WIDE_IMG.push(`${artist} :: ${wip}`);
    }

    return result;
}

function getShowDate(line: string) {
    const result = { showdate: '' };
    const found = line.match(/^.*(\d\d)-(\d\d)-(\d\d)(.*)$/);
    if (found) {
        result.showdate = '20' + found[3] + "-" + found[1] + "-" + found[2];
    }
    return result;
}

async function getVenue(line: string, logger: string) {
    const result = { name: line, image: '', height: 0, width: 0 };
    let venueName = line;
    if (venueName.startsWith('The ')) venueName = venueName.substring(4) + 'The';
    const stripped = strip(venueName) + 'Logo';
    try {
        const files = (await fsp.readdir(VENUE_IMG_PATH)).filter(fn => fn.startsWith(stripped));
        if (files.length > 0) {
            const fullPath = path.join(VENUE_IMG_PATH, files[0]);
            const dim = sizeOf(fullPath);
            result.image = `/images/venues/${files[0]}`;
            result.height = dim.height!;
            result.width = dim.width!;
        }
    } catch (error) {
        console.error(`Error loading venue image for ${logger}:`, error);
        MISSING_VENUE_IMG.push(`${stripped} :: ${logger}`);
    }
    return result;
}

function getCity(line: string) {
    const commaPos = line.indexOf(', ');
    return {
        city: commaPos > -1 ? line.substring(0, commaPos) : line,
        city_state: line
    };
}

function getLinks(fileContents: string[], logger: string) {
    const result = { pcloud: '', archive: '' };
    let possibleLink = fileContents.shift()?.trim();
    while (possibleLink) {
        if (possibleLink.includes('pcloud.com') || possibleLink.includes('u.pcloud.link')) {
            result.pcloud = possibleLink;
        } else if (possibleLink.includes('archive.org')) {
            result.archive = possibleLink;
        }
        possibleLink = fileContents.shift()?.trim();
    }
    if (!result.pcloud) MISSING_PCLOUD.push(logger);
    if (!result.archive) MISSING_ARCHIVE.push(logger);
    return result;
}

function getTheRest(fileContents: string[]): string[] {
    return fileContents.map(line => line.trim());
}

async function getSampleFile(artist: string, showdate: string, showdateplus: string): Promise<string> {
    if (!artist || !showdate) return '';
    const artist_temp = artist.startsWith('The ') ? artist.substring(4) + ', The' : artist;
    const artist_stripped = strip(artist_temp).toLowerCase();
    const possibleSampleFile = artist_stripped + showdate + showdateplus + '.mp3';
    const filePath = path.join(MP3_PATH, possibleSampleFile);
    try {
        await fsp.access(filePath);
        return `/music/${possibleSampleFile}`;
    } catch {
        console.warn('MISSING: sample file', possibleSampleFile);
        MISSING_SAMPLES.push(`${possibleSampleFile} :: ${artist} :: ${showdate}`);
        return '';
    }
}