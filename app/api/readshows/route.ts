
import fs from 'fs';
import { existsSync } from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { removeAllShows, addShow } from './database';
import sizeOf from 'image-size';
import { strip } from '@/app/lib/util';

export async function GET(request: Request): Response{
//	console.warn('readShowFiles');
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
//		console.warn('filenames', filenames);
		
		removeAllShows();
		
		let inc = 0;
		for(const filename of filenames){
			console.warn('importing', filename);
			const fileContents = await readFile(filename);
			const showInfo = {};
			showInfo.sources = getSource(fileContents, filename);
			showInfo.artist = fileContents.shift().trim();
			showInfo.artist_sort = getArtistSort(showInfo.artist);
			const artist_images = getArtistImages(showInfo.artist);
			showInfo.artist_wide = artist_images.wide_image;
			showInfo.artist_wide_h = artist_images.wide_height;
			showInfo.artist_wide_w = artist_images.wide_width;
			showInfo.artist_square = artist_images.square_image;
			showInfo.artist_square_h = artist_images.square_height;
			showInfo.artist_square_w = artist_images.square_width;
			const { showdate, showdateplus } = getShowDate(fileContents.shift().trim());
			showInfo.showdate = showdate;
			const logger = showInfo.artist + ' :: ' + showInfo.showdate;
			const venue = getVenue(fileContents.shift().trim(), logger);
			showInfo.venue = venue.name;
			showInfo.venue_logo = venue.image;
			showInfo.venue_logo_h = venue.height;
			showInfo.venue_logo_w = venue.width;
			const { city, city_state } = getCity(fileContents.shift().trim());
			showInfo.city = city;
			showInfo.city_state = city_state;
			const { pcloud, archive } = getLinks(fileContents, logger);
			showInfo.pcloudlink = pcloud;
			showInfo.archivelink = archive;
			showInfo.setlist = JSON.stringify(getTheRest(fileContents));
			showInfo.samplefile = getSampleFile(showInfo.artist, showInfo.showdate, showdateplus);
			console.warn('showInfo', showInfo);
			const result = addShow(showInfo);
			inc++;
		}
		
		writeLogFile('missing_archive_links.txt', MISSING_ARCHIVE);
		writeLogFile('missing_artist_wide_imgs.txt', MISSING_ARTIST_WIDE_IMG);
		writeLogFile('missing_artist_square_imgs.txt', MISSING_ARTIST_SQUARE_IMG);
		writeLogFile('missing_pcloud_links.txt', MISSING_PCLOUD);
		writeLogFile('missing_sample_files.txt', MISSING_SAMPLES);
		writeLogFile('missing_venue_imgs.txt', MISSING_VENUE_IMG);
		writeLogFile('unknown_sources.txt', UNKNOWN_SOURCE);
		
		return NextResponse.json(`imported ${inc} shows into db`);
	}catch(error){
		console.error('FileSystem Error:', error);
		throw new Error('Failed to Read Shows into DB.');
	}
}

async function getFilenames(){
	const dir = path.resolve(PATH);
//	console.warn('dir', dir);
	const filenames = await fs.readdirSync(dir);
//	console.warn('filenames', filenames);
	return filenames;
}

async function readFile(filename: string):string{
	const fileContents = await fsp.readFile(PATH + filename);
	const fcs = fileContents.toString();
//	console.warn('fileContents', fcs);
	const result = fcs.split("\n");
//	console.warn('result', result);
	return result;
}

function getSource(fileContents: Array, filename: string):string{
	const sourceLine = fileContents.filter(line => line.includes("source: "))[0];
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

function getArtistSort(line: string):string{
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

function getArtistImages(artist: string):Array{
	console.warn('getArtistImages', artist);
	let result = [];
	result.square_image = '', result.square_height = 0,  result.square_width = 0;
	result.wide_image = '', result.wide_height = 0, result.wide_width = 0;
	let wip = artist;
	if(wip.substring(0, 4) === 'The '){ wip = wip.substring(4) + 'The'; }
	wip = strip(wip) + 'Logo';
	console.warn('artist-logo wip', wip);

	let files = fs.readdirSync(ARTIST_SQUARE_IMG_PATH).filter(fn => fn.startsWith(wip));
	console.warn('ARTIST_SQUARE_IMG_PATH', ARTIST_SQUARE_IMG_PATH, files);
	if(files.length > 0){
		result.square_image = ARTIST_SQUARE_IMG_PATH + files.shift();
		const dimensions = sizeOf(result.square_image);
		result.square_height = dimensions.height;
		result.square_width = dimensions.width;
		result.square_image = result.square_image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
	}else{
		MISSING_ARTIST_SQUARE_IMG.push(`${artist} :: ${wip}`);
	}
	
	files = fs.readdirSync(ARTIST_WIDE_IMG_PATH).filter(fn => fn.startsWith(wip));
	console.warn('ARTIST_WIDE_IMG_PATH', ARTIST_WIDE_IMG_PATH, files);
	if(files.length > 0){
		result.wide_image = ARTIST_WIDE_IMG_PATH +files.shift();
		const dimensions = sizeOf(result.wide_image);
		result.wide_height = dimensions.height;
		result.wide_width = dimensions.width;
		result.wide_image = result.wide_image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
	}else{
		MISSING_ARTIST_WIDE_IMG.push(`${artist} :: ${wip}`);
	}

	console.warn('getArtistImages', result);
	return result;	
}

function getShowDate(line: string):Array{
	let result = [];
	const found = line.match(/^.*(\d\d)\-(\d\d)\-(\d\d)(.*)$/);
	result.showdate = '20' + found[3] + "-" + found[1] + "-" + found[2];
	result.showdateplus = (found[4] ? found[4] : '');//only used to find the mp3 sample, at this point, not saved to db
	return result;
}

function getVenue(line: string, logger: string):string{
	let result = [];
	result.name = line;
	result.image = '', result.height = 0, result.width = 0;
	if(line.substring(0, 4) === 'The '){ line = line.substring(4) + 'The'; }
	const stripped = strip(line) + 'Logo';
	const files = fs.readdirSync(VENUE_IMG_PATH).filter(fn => fn.startsWith(stripped));
	console.warn('VENUE_IMG_PATH', VENUE_IMG_PATH, files);
	if(files.length > 0){
		result.image = VENUE_IMG_PATH + files.shift();
		const dimensions = sizeOf(result.image);
		result.height = dimensions.height;
		result.width = dimensions.width;
		result.image = result.image.substring(8);//remove leading './public', which was required to retrieve the file (but not to display)
	}else{
		MISSING_VENUE_IMG.push(`${stripped} :: ${logger}`);
	}
	return result;	
}

function getCity(line: string):Array{
	let result = [];
	const commaPos = line.indexOf(', ');
	result.city = (commaPos ? line.substring(0, commaPos) : line);
	result.city_state = line;
	return result;
}

function getLinks(fileContents: Array, logger: string):Array{
	let result = { 'pcloud': '', 'archive': '' };
	let possibleLink = fileContents.shift().trim();
	while(possibleLink){
//		console.warn('possibleLink', possibleLink);
		if(possibleLink.includes('my.pcloud.com') || possibleLink.includes('u.pcloud.link')){
			result.pcloud = possibleLink;
		}else
		if(possibleLink.includes('archive.org')){
			result.archive = possibleLink;
		}
		possibleLink = fileContents.shift().trim();
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

function getTheRest(fileContents: Array):Array{
	let result = [];
	while(fileContents.length > 0){
		result.push(fileContents.shift().trim());
	}
	return result;
}

function getSampleFile(artist: string, showdate: string, showdateplus: string):string{
	let result = '';
	const artist_temp = (artist.substring(0, 4) === 'The ' ? artist.substring(4) + ', The' : artist);
	const artist_stripped = strip(artist_temp).toLowerCase();
	const possibleSampleFile = artist_stripped + showdate + showdateplus + '.mp3';
	console.warn('possibleSampleFile', possibleSampleFile);
	if(existsSync(MP3_PATH + possibleSampleFile)){
		result = MP3_PATH + possibleSampleFile;
	}else{
		console.warn('MISSING: sample file', possibleSampleFile);
		MISSING_SAMPLES.push(`${possibleSampleFile} :: ${artist} :: ${showdate}`);
	}
	return result;
}

async function writeLogFile(filename: string, data: Array){
	let output = '';
	data.sort();
	data.forEach((line) => output = output + line + '\n');
	await fs.writeFileSync(OUTPUT_PATH + filename, output);
	console.warn('wrote log file', filename);
}

const ARTIST_SQUARE_IMG_PATH = './public/images/artists/square/';
const ARTIST_WIDE_IMG_PATH = './public/images/artists/wide/';
const MP3_PATH = './public/music/';
const OUTPUT_PATH = './public/output/';
const PATH = './public/files/';
const VENUE_IMG_PATH = './public/images/venues/';
	
//logging files
let MISSING_ARCHIVE = [];
let MISSING_ARTIST_SQUARE_IMG = [];
let MISSING_ARTIST_WIDE_IMG = [];
let MISSING_PCLOUD = [];
let MISSING_SAMPLES = [];
let MISSING_VENUE_IMG = [];
let UNKNOWN_SOURCE = [];

//these should be in the order i want them displayed on the "sort by source" page...
//NOTE: changing these requires a change to the database as well
const GAP = 4;//Golden Age Project FC4s
const AT853 = 5;//AudioTechnica 853s
const MATRIX_WITH_GAP = 8;//SBD + Golden Age Projects
const MATRIX_WITH_AT853 = 9;//SBD + AT853
const MATRIX_WITH_H5 = 10;//SBD + ZoomH5
const MATRIX_WITH_H6 = 11;//SBD + ZoomH6
const MATRIX_WITH_H4 = 12;//SBD + ZoomH4n
const SBD = 20;//Soundboard
const MBHO = 25;//MBHO (patched into grout's rig)
const OTHER = 29;//other (anything else will probably be better than the Zoom mics)
const ZOOMH5 = 34;//ZoomH5
const ZOOMH6 = 35;//ZoomH6
const ZOOMH4 = 36;//ZoomH4n
