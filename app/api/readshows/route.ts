
import conn from '@/lib/db';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path'
import { NextResponse } from 'next/server'

const PATH = './public/files/';
	
export async function GET(request: Request): Response{
	console.warn('readShowFiles');
	try{
		const filenames = await getFilenames();
		console.warn('filenames', filenames);
		
		//TODO: remove all shows from DB
		let fileContents = '>nothing<';
		for(const filename of filenames){
			console.warn('filename', filename);
			fileContents = await readFile(filename);
			console.warn('fileContents.toString', fileContents);
			
			break;
		}
			
		
		
		return NextResponse.json(fileContents);
	}catch(error){
		console.error('FileSystem Error:', error);
		throw new Error('Failed to retrieve show filenames.');
	}
}

async function getFilenames(){
	const dir = path.resolve(PATH);
	console.warn('dir', dir);
	const filenames = await fs.readdirSync(dir);
//	console.warn('filenames', filenames);
	return filenames;
}

async function readFile(filename){
	const fileContents = await fsp.readFile(PATH + filename);
	console.warn('fileContents', fileContents);
	return fileContents.toString();
}