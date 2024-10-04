
import Image from "next/legacy/image";
import { getFeaturedBands } from '@/app/lib/database';

export default async function FrequentBands(){
	const bands = await getFeaturedBands();
	const randoms = [];
	for(let i=0; i<20 && i<bands.length; i++){
		const randompos = Math.floor(Math.random() * bands.length);
		const randomlogo = bands.splice(randompos, 1)[0];
		randoms.push(randomlogo);
	}
	return (
		<>
			{randoms.map(logo=>{
				return (<Logo name={logo} key={logo} />);
			})}
		</>
	);
}

//using the Image tag in the default function is not allowed, it makes this file a client component (somehow)
export function Logo({ name }: { name: string; }){
//	const postfix = name.split('.').pop();
	return (
		<div className="relative h-40 w-64 gap-4 mt-4">
			<Image src={name} alt={name} layout="fill" objectFit="contain" />
		</div>
	);
}