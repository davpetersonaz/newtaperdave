//app/showinfo/[artist]/[showdate]/[source]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getShow } from '@/lib/database';
import { ShowInfo } from '@/types/ShowInfoType';

export default async function Page({ params }: { params: Promise<{ artist:string; showdate:string; source:string }> }){
	const { artist, showdate, source } = await params;
	console.info('showinfo', artist, showdate, source);
	if (!artist || !showdate || !source) {
		return <div>Invalid parameters</div>;
	}

	const decodedArtist = decodeURIComponent(artist);
	const showinfo: ShowInfo | null = await getShow(decodedArtist, showdate, source);
	console.info('showinfo', showinfo);
	if (!showinfo) {
		return <div>Show not found</div>;
	}

	const artist_image = (showinfo.artist_square
			? (<Image
					src={showinfo.artist_square}
					alt={showinfo.artist || 'Artist'}
					height={showinfo.artist_square_h || 300}
					width={showinfo.artist_square_w || 300}
					className='mx-auto pb-4'
					loading='lazy'
				/>)
			: (<p className='text-4xl font-bold'>{showinfo.artist}</p>)
	);
	const venue_image = (showinfo.venue_logo
			?	(<Image
					src={showinfo.venue_logo}
					alt={showinfo.venue || 'Venue'}
					height={showinfo.venue_logo_h || 300}
					width={showinfo.venue_logo_w || 300}
					className='mx-auto pt-4 pb-8'
					loading='lazy'
				/>)
			:	(<p className='text-3xl font-bold pb-8'>{showinfo.venue}</p>)
	);
	const pcloud_link = (showinfo.pcloudlink
			?	(<Link href={showinfo.pcloudlink} className='pb-8'>Link to MP3 Download on pCloud</Link>)
			:	(<></>)
	);
	const sample = (showinfo.samplefile
			?	(<>
					<div className='mt-8 pt-3 border-2 border-black border-solid rounded'>
						<p>20-second sample</p>
						<audio controls preload="auto" className='w-[300px] h-[54px] mx-auto' aria-label="20-second sample of the show">
							<source src={showinfo.samplefile.startsWith('./public/') ? showinfo.samplefile.substring(8) : showinfo.samplefile} type='audio/mpeg'/>
							Your browser does not support the audio element.
						</audio>
					</div>
				</>)
			:	(<></>)
	);

	// Parse setlist safely into string[]
	let setlist:string[] = [];
	if(showinfo.setlist){
		try {
			setlist = JSON.parse(showinfo.setlist);
		} catch (error) {
			console.error('Failed to parse setlist:', error, 'Setlist value:', showinfo.setlist);
		}
	}
	// Map setlist to JSX elements
	const setlist_str = setlist.map((line, index) =>
		line === ''
			? ( <div key={index} className="my-2" /> ) // Adds vertical spacing for blank lines
			: ( <li key={index}>{line}</li> )
	);

	return (
		<div className='text-center'>
			<div className='grid grid-cols-2 gap-16'>
				<div className='flex justify-center items-center'>
					<div className='pt-8'>
						{artist_image}
						<p>at</p>
						{venue_image}
						{pcloud_link}
						{sample}
					</div>
				</div>
				<div>
					<div className='text-left'>
						<p className='text-5xl font-bold pb-4'>{showinfo.artist}</p>
						<p className='text-4xl pb-2'>{showinfo.showdate}</p>
						<p className='text-3xl'>{showinfo.venue}</p>
						<p className='text-2xl pb-8'>{showinfo.city_state}</p>
						<ul>{setlist_str}</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
