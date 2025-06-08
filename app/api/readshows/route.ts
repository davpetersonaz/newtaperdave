//app/api/readshows/route.ts
import fs from 'fs';
import { existsSync } from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { removeAllShows, addShow, createCache } from './database';
import { GAP, AT853, MATRIX_WITH_GAP, MATRIX_WITH_AT853, MATRIX_WITH_H5, MATRIX_WITH_H6, MATRIX_WITH_H4, SBD, MBHO, OTHER, ZOOMH5, ZOOMH6, ZOOMH4 } from './database';
import { getShowListAlpha, getShowListChrono, getShowListCity, getShowListSource, getShowListVenue } from '../../lib/database';
import sizeOf from 'image-size';
import { strip } from '@/lib/util';
import { ShowInfo } from '@/types/ShowInfoType';

interface Venue {
	name: string;
	image: string;
	height: number;
	width: number;
}
interface ArtistImages {
	square_image: string;
	square_height: number;
	square_width: number;
	wide_image: string;
	wide_height: number;
	wide_width: number;
}
interface ShowDate {
	showdate: string;
	showdateplus: string;
}
interface City {
	city: string;
	city_state: string;
}
interface Links {
	pcloud: string;
	archive: string;
}

export async function GET(request: Request){
	console.log('readShows called at:', new Date(), 'Environment:', process.env.NODE_ENV);
	try{
		//reset these
		MISSING_ARCHIVE = [];
		MISSING_ARTIST_SQUARE_IMG = [];
		MISSING_ARTIST_WIDE_IMG = [];
		MISSING_PCLOUD = [];
		MISSING_SAMPLES = [];
		MISSING_VENUE_IMG = [];
		UNKNOWN_SOURCE = [];

		const filenames = await getFilenames();
//		console.info('filenames', filenames);
		await removeAllShows();

		let inc = 0;
		for(const filename of filenames){
			console.info('importing', filename);
			const fileContents: string[] = await readFile(filename);
			// Skip empty or invalid files
			if (!fileContents.length) {
				console.warn(`Skipping empty file: ${filename}`);
				continue;
			}
			const showInfo: ShowInfo = {};

			// Safely extract artist
			const artistLine = fileContents.shift();
			if (!artistLine) {
				console.warn(`Missing artist in file: ${filename}`);
				continue;
			}
			showInfo.artist = artistLine.trim();
			showInfo.artist_sort = getArtistSort(showInfo.artist);
			// Extract other fields with safety checks
			showInfo.sources = getSource(fileContents, filename);
			const artist_images = await getArtistImages(showInfo.artist!);
			showInfo.artist_wide = artist_images.wide_image;
			showInfo.artist_wide_h = artist_images.wide_height;
			showInfo.artist_wide_w = artist_images.wide_width;
			showInfo.artist_square = artist_images.square_image;
			showInfo.artist_square_h = artist_images.square_height;
			showInfo.artist_square_w = artist_images.square_width;
			const dateLine = fileContents.shift();
			if (!dateLine) {
				console.warn(`Missing show date in file: ${filename}`);
				continue;
			}
			const { showdate, showdateplus } = getShowDate(dateLine.trim());
			showInfo.showdate = showdate;

			const logger: string = `${showInfo.artist} :: ${showInfo.showdate}`;
			const venueLine = fileContents.shift();
			if (!venueLine) {
				console.warn(`Missing venue in file: ${filename}`);
				continue;
			}
			const venue: Venue = await getVenue(venueLine.trim(), logger);
			showInfo.venue = venue.name;
			showInfo.venue_logo = venue.image;
			showInfo.venue_logo_h = venue.height;
			showInfo.venue_logo_w = venue.width;
			const cityLine = fileContents.shift();
			if (!cityLine) {
				console.warn(`Missing city in file: ${filename}`);
				continue;
			}
			console.warn('fileContents after extracting city:', fileContents);
			const { city, city_state } = getCity(cityLine.trim());
			showInfo.city = city;
			showInfo.city_state = city_state;
			const { pcloud, archive } = getLinks(fileContents, logger);
			console.warn('fileContents after extracting pcloud/archive:', fileContents);
			showInfo.pcloudlink = pcloud;
			showInfo.archivelink = archive;
			showInfo.setlist = JSON.stringify(getTheRest(fileContents));
			showInfo.samplefile = await getSampleFile(showInfo.artist!, showInfo.showdate!, showdateplus);
			console.info('showInfo', showInfo);
			// Validate required fields
			if (!showInfo.artist || !showInfo.showdate || !showInfo.venue || !showInfo.city) {
				console.warn(`Skipping incomplete showInfo for file: ${filename}`);
				continue;
			}
			await addShow(showInfo);
			inc++;
		}

		if(process.env.NODE_ENV === 'development'){
			await Promise.all([
				writeLogFile('missing_archive_links.txt', MISSING_ARCHIVE),
				writeLogFile('missing_artist_wide_imgs.txt', MISSING_ARTIST_WIDE_IMG),
				writeLogFile('missing_artist_square_imgs.txt', MISSING_ARTIST_SQUARE_IMG),
				writeLogFile('missing_pcloud_links.txt', MISSING_PCLOUD),
				writeLogFile('missing_sample_files.txt', MISSING_SAMPLES),
				writeLogFile('missing_venue_imgs.txt', MISSING_VENUE_IMG),
				writeLogFile('unknown_sources.txt', UNKNOWN_SOURCE)
			]);
		}

		// Create caches
		await Promise.all([
			createCache(getShowListAlpha),
			createCache(getShowListChrono),
			createCache(getShowListCity),
			createCache(getShowListSource),
			createCache(getShowListVenue),
		]);

		return NextResponse.json(`imported ${inc} shows into db`);
	}catch(error){
		console.error('FileSystem Error:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to Read Shows into DB: ${errorMessage}`);
	}
}

async function getFilenames(): Promise<string[]> {
	const dir = path.resolve(PATH);
//	console.info('dir', dir);
	try{
		const filenames = await fsp.readdir(dir);
		// console.info('filenames', filenames);
		return filenames;
	}catch(error){
		console.error(`Error reading directory ${dir}:`, error);
		return [];
	}
}

async function readFile(filename:string): Promise<string[]> {
	try{
		const fileContents = await fsp.readFile(PATH + filename, 'utf-8');
		return fileContents.split('\n');
	}catch(error){
		console.error(`Error reading file ${filename}:`, error);
		return [];
	}
}

function getSource(fileContents: string[], filename: string): number {
	const sourceLine = fileContents.find((line) => line.includes("source: "));
	let source = OTHER;
	if(sourceLine){
		const sourceLower = sourceLine.toLowerCase();
		if(sourceLower.includes('sbd + at853')){
			source = MATRIX_WITH_AT853;
		}else if(sourceLower.includes('sbd + zoomh4')){
			source = MATRIX_WITH_H4;
		}else if(sourceLower.includes('sbd + zoomh5')){
			source = MATRIX_WITH_H5;
		}else if(sourceLower.includes('sbd + zoomh6')){
			source = MATRIX_WITH_H6;
		}else if(sourceLower.includes('sbd + golden age')){
			source = MATRIX_WITH_GAP;
		}else if(sourceLower.includes('sbd')){
			source = SBD;
		}else if(sourceLower.includes('at853')){
			source = AT853;
		}else if(sourceLower.includes('golden age')){
			source = GAP;
		}else if(sourceLower.includes('zoomh4')){
			source = ZOOMH4;
		}else if(sourceLower.includes('zoomh5')){
			source = ZOOMH5;
		}else if(sourceLower.includes('zoomh6')){
			source = ZOOMH6;
		}else if(sourceLower.includes('mbho')){
			source = MBHO;
		}else{
			console.warn("ERROR: unknown source", filename);
			UNKNOWN_SOURCE.push(`${filename} :: ${sourceLine}`);
		}
	}else{
		console.warn("ERROR: no source field", filename);
		UNKNOWN_SOURCE.push(`${filename} :: >no source<`);
	}
	return source;
}

function getArtistSort(line: string): string{
	let result = line;
	if(line.substring(0, 4).toLowerCase() === 'the '){
		result = line.substring(4) + ', The';
	}else
	if(line.substring(0, 2).toLowerCase() === 'a '){
		result = line.substring(2) + ', A';
	}else
	if(line.substring(0, 3).toLowerCase() === 'an '){
		result = line.substring(3) + ', An';
	}
	return result;
}

async function getArtistImages(artist: string): Promise<ArtistImages>{
	console.info('getArtistImages', artist);
	const result: ArtistImages = {
		square_image: '',
		square_height: 0,
		square_width: 0,
		wide_image: '',
		wide_height: 0,
		wide_width: 0,
	};
	let wip:string = artist;
	if(wip.substring(0, 4) === 'The '){ wip = wip.substring(4) + 'The'; }
	wip = strip(wip) + 'Logo';
	console.info('getArtistImages wip', wip);

	try{
		const squareFiles = (await fsp.readdir(ARTIST_SQUARE_IMG_PATH)).filter((fn) => fn.startsWith(wip));
		console.info('squareFiles filtered:', squareFiles);
		if(squareFiles.length > 0){
			result.square_image = ARTIST_SQUARE_IMG_PATH + squareFiles[0];
			console.info('result.square_image:', result.square_image);
			const dimensions = sizeOf(result.square_image);
			console.info('dimensions:', dimensions);
			result.square_height = dimensions.height!;
			result.square_width = dimensions.width!;
			result.square_image = result.square_image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
		}else{
			console.warn('No square image found for:', artist, wip);
			MISSING_ARTIST_SQUARE_IMG.push(`${artist} :: ${wip}`);
		}
	} catch (error) {
		console.error(`Error reading square artist image for ${artist}:`, error);
		MISSING_ARTIST_SQUARE_IMG.push(`${artist} :: ${wip}`);
	}

	try{
		const wideFiles = (await fsp.readdir(ARTIST_WIDE_IMG_PATH)).filter((fn) => fn.startsWith(wip));
		console.info('wideFiles filtered:', wideFiles);
		if(wideFiles.length > 0){
			result.wide_image = ARTIST_WIDE_IMG_PATH + wideFiles[0];
			console.info('result.wide_image:', result.wide_image);
			const dimensions = sizeOf(result.wide_image);
			console.info('dimensions:', dimensions);
			result.wide_height = dimensions.height!;
			result.wide_width = dimensions.width!;
			result.wide_image = result.wide_image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
		}else{
			console.warn('No wide image found for:', artist, wip);
			MISSING_ARTIST_WIDE_IMG.push(`${artist} :: ${wip}`);
		}
	} catch (error) {
		console.error(`Error reading wide artist image for ${artist}:`, error);
		MISSING_ARTIST_WIDE_IMG.push(`${artist} :: ${wip}`);
	}

	console.info('getArtistImages', result);
	return result;
}

function getShowDate(line:string): ShowDate {
	const result:ShowDate = { showdate: '', showdateplus: '' };
	const found = line.match(/^.*(\d\d)\-(\d\d)\-(\d\d)(.*)$/);
	if (found) {
		result.showdate = '20' + found[3] + "-" + found[1] + "-" + found[2];
		result.showdateplus = (found[4] ? found[4] : '');//only used to find the mp3 sample, at this point, not saved to db
	}
	return result;
}

async function getVenue(line:string, logger:string): Promise<Venue>{
	const result: Venue = { name: line, image: '', height: 0, width: 0 };
	let venueName = line;
	if(venueName.substring(0, 4) === 'The '){
		venueName = venueName.substring(4) + 'The';
	}
	const stripped = strip(venueName) + 'Logo';

	try{
		const files = (await fsp.readdir(VENUE_IMG_PATH)).filter((fn) => fn.startsWith(stripped));
		if(files.length > 0){
			result.image = VENUE_IMG_PATH + files[0];
			const dimensions = sizeOf(result.image);
			result.height = dimensions.height!;
			result.width = dimensions.width!;
			result.image = result.image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
		}else{
			MISSING_VENUE_IMG.push(`${stripped} :: ${logger}`);
		}
	}catch(error){
		console.error(`Error reading venue images for ${logger}:`, error);
		MISSING_VENUE_IMG.push(`${stripped} :: ${logger}`);
	}
	return result;
}

function getCity(line:string): City {
	const result:City = { city: '', city_state: '' };
	const commaPos = line.indexOf(', ');
	result.city = (commaPos ? line.substring(0, commaPos) : line);
	result.city_state = line;
	return result;
}

function getLinks(fileContents:string[], logger:string): Links {
	const result:Links = { 'pcloud': '', 'archive': '' };
	let possibleLink = fileContents.shift()?.trim();
	while(possibleLink){
//		console.info('possibleLink', possibleLink);
		if(possibleLink.includes('my.pcloud.com') || possibleLink.includes('u.pcloud.link')){
			result.pcloud = possibleLink;
		}else
		if(possibleLink.includes('archive.org')){
			result.archive = possibleLink;
		}
		possibleLink = fileContents.shift()?.trim();
	}
	if(!result.pcloud){
		console.warn('MISSING: pcloud link', logger);
		MISSING_PCLOUD.push(logger);
	}
	if(!result.archive){
		console.warn('MISSING: archive link', logger);
		MISSING_ARCHIVE.push(logger);
	}
	return result;
}

function getTheRest(fileContents:string[]): string[] {
	const result: string[] = [];
	while(fileContents.length > 0){
		const line = fileContents.shift()?.trim() ?? ''; // Use '' for undefined lines
		result.push(line); // Include all lines, empty or not
	}
	return result;
}

async function getSampleFile(artist:string, showdate:string, showdateplus:string):Promise<string>{
	let result = '';
	const artist_temp = (artist.substring(0, 4) === 'The ' ? artist.substring(4) + ', The' : artist);
	const artist_stripped = strip(artist_temp).toLowerCase();
	const possibleSampleFile = artist_stripped + showdate + showdateplus + '.mp3';
	console.info('possibleSampleFile', possibleSampleFile);
	const filePath = MP3_PATH + possibleSampleFile;
	try {
		await fsp.access(filePath);
		result = filePath.substring(8); // Remove './public' from path-joined url
	} catch (error) {
		console.warn('MISSING: sample file', possibleSampleFile);
		MISSING_SAMPLES.push(`${possibleSampleFile} :: ${artist} :: ${showdate}`);
	}
	return result;
}

async function writeLogFile(filename:string, data:string[]): Promise<void> {
	if (process.env.NODE_ENV !== 'development') {
		console.info('Skipping log file write in production:', filename, data);
		return;
	}
	try{
		let output = '';
		data.sort();
		data.forEach((line) => (output += line + '\n'));
		await fsp.writeFile(OUTPUT_PATH + filename, output);
		console.info('wrote log file', filename);
	}catch(error){
		console.error(`Error writing log file ${filename}:`, error);
	}
}

const ARTIST_SQUARE_IMG_PATH = './public/images/artists/square/';
const ARTIST_WIDE_IMG_PATH = './public/images/artists/wide/';
const MP3_PATH = './public/music/';
const OUTPUT_PATH = './public/output/';
const PATH = './public/files/';
const VENUE_IMG_PATH = './public/images/venues/';

//logging files
let MISSING_ARCHIVE: string[] = [];
let MISSING_ARTIST_SQUARE_IMG: string[] = [];
let MISSING_ARTIST_WIDE_IMG: string[] = [];
let MISSING_PCLOUD: string[] = [];
let MISSING_SAMPLES: string[] = [];
let MISSING_VENUE_IMG: string[] = [];
let UNKNOWN_SOURCE: string[] = [];
