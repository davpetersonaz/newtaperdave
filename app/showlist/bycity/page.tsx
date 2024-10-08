
import { Metadata } from 'next';
import Link from 'next/link';
import Image from "next/image";
import { strip } from '@/app/lib/util';
import { getShowListCity, getQueryCache } from '@/app/lib/database';
import dateformat from "dateformat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // FontAwesomeIcon component
import { faFileArrowDown, faFileZipper, faPlay } from "@fortawesome/free-solid-svg-icons"; // individual icons necessary

export const metadata: Metadata = {
	title: 'List of Shows',
}

export default async function Page(){
	let showlist = await getQueryCache(getShowListCity.name);
	console.warn('getShowListCity cache used', showlist !== '');
	showlist = (showlist === '' ? await getShowListCity() : JSON.parse(showlist));
	console.warn('showlist', showlist.length);
	const output = [];
	output.push(
		<div>
			<p className='text-4xl font-bold pb-8'>Shows I Have Taped</p>
		</div>
	);
	let currentCity = 'unset';
	let shows = [];
		
	showlist.map(async (show) => {
		if(show.city_state !== currentCity){
//			console.warn('new city', show.city_state);
//			console.warn('shows.length', shows.length);
			//dont do this on the first pass thru the showlist
			if(shows.length){
				//write the previous city and the shows
//				console.warn('push more output');
				output.push(
					<div id={strip(currentCity)}>
						<div className='pb-4'>
							<p className='text-3xl font-bold'>{currentCity}</p>
						</div>
						<ul className='pb-8'>
							{shows.map((line) => (
								<li key={line.show_id}>
									<Link href={'/showinfo/'+line.artist+'/'+line.showdate+'/'+line.source_num}><span className='text-1xl font-bold'>{line.artist}</span> - {line.showdate} - {line.venue} - {line.sourcetext}</Link> {line.pcloudlink} {line.archivelink} {line.samplefile}
								</li>
							))}
						</ul>
					</div>
				);
			}else{
//				console.warn('skipped object push');
			}
			currentCity = show.city_state;
			shows = [];
//			console.warn('reset city', currentCity);
			//now start the new city's shows
		}
//		console.warn('add show', show);
		const line = [];
		line.show_id = show.show_id;
		line.artist = show.artist;
		line.showdate = show.showdate;
		line.venue = show.venue;
		line.city = show.city;
		line.source_num = show.sources;
		line.sourcetext = show.sourcetext;
		line.archivelink = (show.archivelink === '' ? <></> :	( <Link href={show.archivelink} target="_blank"> <FontAwesomeIcon icon={faFileZipper} /> </Link> ) );
		line.pcloudlink =  (show.pcloudlink === '' ?  <></> :	( <Link href={show.pcloudlink} target="_blank">  <FontAwesomeIcon icon={faFileArrowDown} /> </Link> ) );
		line.samplefile =  (show.samplefile === '' ?  <></> :	( <Link href={'/showinfo/'+line.artist+'/'+line.showdate+'/'+line.source_num} target="_blank">  <FontAwesomeIcon icon={faPlay} /> </Link> ) );
		shows.push(line);
//		console.warn('shows updated', shows.length);
	});
//	console.warn('output size', output.length);

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