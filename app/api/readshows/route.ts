
import conn from '@/lib/db';
import fs from 'fs';
import { existsSync } from 'fs';
import fsp from 'fs/promises';
import path from 'path'
import { NextResponse } from 'next/server'

const PATH = './public/files/';
	
export async function GET(request: Request): Response{
//	console.warn('readShowFiles');
	try{
		const filenames = await getFilenames();
//		console.warn('filenames', filenames);
		
		//TODO: remove all shows from DB
		
		let showInfo = {};//TODO: remove this after i've removed the 'break' in the following loop
		let fileContents = '>nothing<';
		for(const filename of filenames){
//			console.warn('filename', filename);
			fileContents = await readFile(filename);
			showInfo = {};//TODO: just initiate it here as a const once i'm no longer exporting it in the response
			showInfo.source = getSource(fileContents);
			showInfo.artist = fileContents.shift().trim();
			showInfo.artist_sort = getArtistSort(showInfo.artist);
			const { showdate, showdateplus } = getShowDate(fileContents.shift().trim());
			showInfo.showdate = showdate;
			showInfo.showdateplus = showdateplus;
			const logger = showInfo.artist+' '+showInfo.showdate;
			showInfo.venue = fileContents.shift().trim();
			const { city, city_state } = getCity(fileContents.shift().trim());
			showInfo.city = city;
			showInfo.city_state = city_state;
			const { pcloud, archive } = getLinks(fileContents, logger);
			showInfo.pcloud = pcloud;
			showInfo.archive = archive;
			showInfo.the_rest = getTheRest(fileContents);
			showInfo.sample_file = getSampleFile(showInfo.artist, showInfo.showdate, showInfo.showdateplus);

			console.warn('showInfo', showInfo);
			
			//TODO: add showInfo to DB
			
			break;//TODO: remove when ready to suck in all shows
		}
		return NextResponse.json(showInfo);
	}catch(error){
		console.error('FileSystem Error:', error);
		throw new Error('Failed to retrieve show filenames.');
	}
}

async function getFilenames(){
	const dir = path.resolve(PATH);
//	console.warn('dir', dir);
	const filenames = await fs.readdirSync(dir);
//	console.warn('filenames', filenames);
	return filenames;
}

async function readFile(filename: String):String{
	const fileContents = await fsp.readFile(PATH + filename);
	const fcs = fileContents.toString();
//	console.warn('fileContents', fcs);
	const result = fcs.split("\n");
//	console.warn('result', result);
	return result;
}

function getSource(fileContents: Array):String{
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
			console.warn("ERROR: unknown source: "+filename);
		}
	}else{
		console.warn("ERROR: no source field: "+filename);
	}
	return source;
}

function getArtistSort(line: String):String{
	let result = line;
	if(line.substring(0, 4).toLowerCase() === 'the '){
		result = line.substring(4)+', The';
	}else
	if(line.substring(0, 2).toLowerCase() === 'a '){
		result = line.substring(2)+', A';
	}else
	if(line.substring(0, 3).toLowerCase() === 'an '){
		result = line.substring(3)+', An';
	}
	return result;
}

function getShowDate(line: String):Array{
	let result = [];
	const found = line.match(/^.*(\d\d)\-(\d\d)\-(\d\d)(.*)$/);
	result.showdate = '20'+found[3]+"-"+found[1]+"-"+found[2];
	result.showdateplus = (found[4] ? found[4] : '');//only used to find the mp3 sample, at this point, not saved to db
	return result;
}

function getCity(line: String):Array{
	let result = [];
	const commaPos = line.indexOf(', ');
	result.city = (commaPos ? line.substring(0, commaPos) : line);
	result.city_state = line;
	return result;
}

function getLinks(fileContents: Array, logger: String):Array{
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
	if(!result.pcloud){ console.warn('MISSING: pcloud link', logger); }
	if(!result.archive){ console.warn('MISSING: archive link', logger); }
	return result;
}

function getTheRest(fileContents: Array):Array{
	let result = [];
	while(fileContents.length > 0){
		result.push(fileContents.shift().trim());
	}
	return result;
}

function getSampleFile(artist: String, showdate: String, showdateplus: String	):String{
	let result = '';
	const artist_stripped = artist.replace(/[\W_]+/g, '').toLowerCase();
	let possibleSampleFileUrl = './public/music/'+artist_stripped+showdate+showdateplus+'.mp3';
	console.warn('possibleSampleFileUrl', possibleSampleFileUrl);
	if(existsSync(possibleSampleFileUrl)){
		result = possibleSampleFileUrl;
	}else{
		console.warn('MISSING: sample file', possibleSampleFileUrl );
	}
	return result;
}

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
