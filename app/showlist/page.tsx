
import { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
import { getShowListAlpha } from '@/app/lib/database';
import dateformat from "dateformat";
import { strip, logoToArtistCamel } from "@/app/lib/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesomeIcon component
import { faFileArrowDown, faFileZipper, faPlay } from "@fortawesome/free-solid-svg-icons"; // individual icons necessary

export const metadata: Metadata = {
	title: 'List of Shows',
}

export default async function Page(){
	const showlist = await getShowListAlpha();
	console.warn('showlist', showlist.length);
	const output = [];
	output.push(
		<div>
			<p className='text-4xl font-bold pb-8'>Shows I Have Taped</p>
		</div>
	);
	let currentArtist = 'unset';
	let artist = []; let shows = [];
		
	showlist.map(async (show) => {
		//write the previous artist and their shows
		if(show.artist !== currentArtist){
			console.warn('new artist', show.artist);
//			console.warn('artist', artist);//<<<< TODO: unsure why artist.length is 0 every time? 
			console.warn('shows.length', shows.length);
			if(shows.length){//dont do this on the first pass thru the showlist
				console.warn('push more output');
				output.push(
					<div id={artist.stripped}>
						<div className='pb-4'>
							{artist.logo === '' ?
								( <p className='text-3xl font-bold'>{artist.name}</p> ) :
									( <Image src={artist.logo} alt={artist.name} height={artist.logo_h} width={artist.logo_w} className='mx-auto border-2 border-black'/> )
							}
						</div>
						<ul className='pb-8'>
							{shows.map((line) => (
								<li key={line.show_id}>
									<Link href={'/showinfo/'+line.artist+'/'+line.showdate+'/'+line.source_num}>{line.showdate} - {line.venue} - {line.sourcetext}</Link> {line.pcloudlink} {line.archivelink} {line.samplefile}
								</li>
							))}
						</ul>
					</div>
				);
			}else{
				console.warn('skipped object push');
			}
			//and new artist
			currentArtist = show.artist;
			shows = [];
			console.warn('reset shows', shows.length);
			artist = [];
			artist.name = show.artist;
			artist.stripped = logoToArtistCamel(show.artist_wide);
			artist.logo = show.artist_wide;
			artist.logo_h = show.artist_wide_h;
			artist.logo_w = show.artist_wide_w;
			console.warn('reset artist filled', artist);
			//now start the new artist's shows
		}
		console.warn('add show', show);
		const line = [];
		line.artist = show.artist;
		line.show_id = show.show_id;
		line.showdate = show.showdate;
		line.venue = show.venue;
		line.source_num = show.sources;
		line.sourcetext = show.sourcetext;
		line.archivelink = (show.archivelink === '' ? <></> :	( <Link href={show.archivelink} target="_blank"> <FontAwesomeIcon icon={faFileZipper} /> </Link> ) );
		line.pcloudlink =  (show.pcloudlink === '' ? <></> :	( <Link href={show.pcloudlink} target="_blank">  <FontAwesomeIcon icon={faFileArrowDown} /> </Link> ) );
		line.samplefile =  (show.samplefile === '' ? <></> :	( <Link href={show.samplefile} target="_blank">  <FontAwesomeIcon icon={faPlay} /> </Link> ) );
		shows.push(line);
		console.warn('shows updated', shows.length, line);
	});

	console.warn('output size', output.length);
	return (
		<>
			<div className='text-center'>
				{Object.values(output)}
			</div>
			<div className="relative">
				<Link href="/api/readshows" className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);

//TODO: not sure how to add the scrollToTop functionality, aside from changing this whole page to a client component	
//	const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js
//	function scrollToTop(){
//		if (!isBrowser()){ return; }
//		window.scrollTo({ top: 0, behavior: 'smooth' });
//	}
}