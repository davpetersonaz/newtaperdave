
import fs from 'fs'
import path from 'path'

export async function fetchSplashImage(){
	try{
//		await new Promise(resolve => setTimeout(resolve, 5000));
//		console.warn('fetchSplashImage');
		const SPLASH_PATH = './public/images/home/';
		const dir = path.resolve(SPLASH_PATH);
//		console.warn('dir', dir);
		const filenames = fs.readdirSync(dir);
//		console.warn('filenames', filenames);
		const random = Math.floor(Math.random() * filenames.length);
//		console.warn('random', random, filenames[random]);
		return "/images/home/" + filenames[random];
	}catch (error){
		console.error('FileSystem Error:', error);
		throw new Error('Failed to retrieve a splash image.');
	}
}
