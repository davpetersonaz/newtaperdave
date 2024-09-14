
import Image from 'next/image';
import { fetchSplashImage } from '@/app/lib/data';

export default async function SplashImage(){
	const splashImage = await fetchSplashImage();
	console.warn('splashImage', splashImage, typeof splashImage);
	return (
		<div className="overflow-hidden">
			<Image src="/images/home/gaps-pigeons20231119.JPG" alt='my mics through the years' width={2100} height={320} className="border-solid border-3 border-black" />
		</div>
	);
}
