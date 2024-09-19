
import conn from '@/lib/db';
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET(request: Request): Response{
	try{
		console.warn('readShowFiles');
		const filenames = await getFilenames();
		console.warn('filenames', filenames);
		return NextResponse.json(filenames);
	}catch(error){
		console.error('FileSystem Error:', error);
		throw new Error('Failed to retrieve show filenames.');
	}
}

async function getFilenames(){
	console.warn('readShowFiles');
	const PATH = './public/files/';
	const dir = path.resolve(PATH);
	console.warn('dir', dir);
	const filenames = await fs.readdirSync(dir);
	console.warn('filenames', filenames);
	return filenames;
}