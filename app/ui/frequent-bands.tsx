
import Image from "next/legacy/image";
import { fetchFrequentBands } from '@/app/lib/data';

export default async function FrequentBands(){
	const bands = await fetchFrequentBands();
//	console.warn('bands', bands, typeof bands);
	return (
		<>
			{bands.map(bandname=>{
				return (<Logo name={bandname} key={bandname} />);
			})}
		</>
	);
}

//using the Image tag in the default function is not allowed, it makes this file a client component (somehow)
export function Logo({ name }: { name: string; }){
	const postfix = name.split('.').pop();
	return (
		<div className="relative h-40 w-64 gap-4 mt-4">
			<Image src={"/images/artists/square/"+name} alt={name} layout="fill" objectFit="contain" />
		</div>
	);
}