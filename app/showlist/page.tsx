
import { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
import { getShowListAlpha } from '../lib/database.ts';

export const metadata: Metadata = {
	title: 'List of Shows',
};

export default function Page(){
	const showlist = getShowListAlpha();
	let currentArtist = 'unset';
	return (
		<>
			<h2 className="text-center">Shows I Have Taped</h2>
			
			{/*
				showlist.map((show) => (
					{show.artist !== currentArtist &&
						<div>
							<div>
								<Image src={show.artist_image} alt={show.artist} width={} height={}>
							</div>
					
						</div>
					}
				));
			*/}
			
			
			
			
			
			
			
			
			<div className="relative">
				<Link href="" className="float-right">Up to Top</Link>
			</div>
			<div className="relative">
				<Link href="/api/readshows" className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);
}