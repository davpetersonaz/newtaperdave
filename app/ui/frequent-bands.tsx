//app/ui/frequent-bands.tsx
import React from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { logoToArtistCamel } from '@/lib/util'; 

export default function FrequentBands({ bands }:{ bands:string[] }){
	const bandSlots = 20;
	const selectedBands = [];

	//randomize bands
	for(let i=0; i<bandSlots && i<bands.length; i++){
		const randompos = Math.floor(Math.random() * bands.length);
		const randomlogo = bands.splice(randompos, 1)[0];
		selectedBands.push(randomlogo);
	}

	return(
		<>
			{selectedBands.map((logo) => (
				<div className="relative h-40 w-64 gap-4 mt-4" key={logo}>
					<Link href={`https://taperdave.vercel.app/showlist#${logoToArtistCamel(logo)}`}>
						<Image src={logo} alt={logo} layout="fill" objectFit="contain" />
					</Link>
				</div>
			))}
		</>
	);
}
