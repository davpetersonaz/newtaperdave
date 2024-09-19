
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

export async function fetchFrequentBands(){
	try{
		//when the DB is ready, fetch about 20 random logos from bands that have more than 3 shows recorded
		//until then, just pass a few i know...
		const unshuffled = [ 
				'BodhiMojoLogo.jpg', 'BoomBoxLogo.jpg', 'DeltaNoveLogo.jpg', 
				'DigginDirtLogo.png', 'EndoplasmicLogo.jpg', 'HypervisorLogo.JPG', 'LeftonWilsonLogo.jpg',
				'LotusLogo.jpg', 'MotetLogo.jpg', 'OrgoneLogo.jpg', 'PlanckLogo.jpg', 'ReebleJarLogo.jpg',
				'SpaffordLogo.png', 'SpunjLogo.jpg', 'StringCheeseIncidentLogo.jpg',
				'TurkuazLogo.jpg', 'UpstateQuartetLogo.jpg'
		];
//		console.warn('unshuffled', unshuffled);
		//This is the "Schwartzian transform" shuffle in js
		const shuffled = unshuffled.map(value=>({ value, sort: Math.random() })).sort((a, b)=> a.sort -b.sort).map(({ value }) => value);
//		console.warn('shuffled', shuffled);
		return shuffled;
	}catch(error){
		console.error('Database Error:', error);
		throw new Error('Failed to retrieve frequent bands.');
	}
}
