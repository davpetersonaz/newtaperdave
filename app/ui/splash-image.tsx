
import Image from "next/image";
import { fetchSplashImage } from '@/app/lib/data';

export default async function SplashImage(){
	const splashImage = await fetchSplashImage();
//	console.warn('splashImage', splashImage, typeof splashImage);
	return (
		<div className="-ml-6 -mr-6">
			<Image src={splashImage} alt="my mics through the years" width={2100} height={320} />
		</div>
	);
	//can't make this work on the Image:  className="border-y-solid border-y-3 border-y-yellow"
}
