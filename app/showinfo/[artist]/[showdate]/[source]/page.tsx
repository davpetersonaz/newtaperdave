
import Image from 'next/image';
import Link from 'next/link';
import { getShow } from '../../../../lib/database';

export default async function Page({ params }: { params: { artist: string, showdate: string, source: string } }){
	console.warn('showinfo', params.artist, params.showdate, params.source);
	const showinfo = await getShow(decodeURIComponent(params.artist), params.showdate, params.source);
	console.warn('showinfo', showinfo);
	const artist_image = (showinfo.artist_square === '' 
			? <><p className='text-4xl font-bold'>{showinfo.artist}</p></> 
			: <><Image src={showinfo.artist_square} alt={showinfo.artist} height={showinfo.artist_square_h} width={showinfo.artist_square_w}/></>);
	const venue_image = (showinfo.venue_logo === '' 
			? <><p className='text-4xl font-bold'>{showinfo.venue}</p></>
			: <><Image src={showinfo.venue_logo} alt={showinfo.venue} height={showinfo.venue_logo_h} width={showinfo.venue_logo_w}/></>);
	const pcloud_link = (showinfo.pcloudlink === '' 
			? <></>
			: <><Link href={showinfo.pcloudlink}>Link to MP3 Download on pCloud</Link></>);
	const sample = (showinfo.samplefile === ''
			? <></>
			:	<>
					<p>20-second sample</p>
					<audio controls className='w-300 h-54 border-1 border-black border-solid rounded m-4 bg-gray-300'>
						<source src={showinfo.samplefile} type='audio/mpeg' className='' />
					</audio>
				</>);
	const setlist = JSON.parse(showinfo.setlist);
	let i = 1;
	const setlist_str = setlist.map(line => line === '' ? ( <br /> ) : ( <li key={i++}>{line === '' ? '  ' : line}</li> ) );
	return (
		<div className='flex flex-row flex-center'>
			<div className='border-solid border-1 border-black text-center'>
				{artist_image}
				<p>at</p>
				{venue_image}
				{pcloud_link}
				{sample}
			</div>
			<div className='border-solid border-1 border-black'>
				<p className='text-4xl font-bold'>{showinfo.artist}</p>
				<p className='text-3xl'>{showinfo.showdate}</p>
				<p className='text-2xl'>{showinfo.venue}</p>
				<p className='text-2xl'>{showinfo.city_state}</p>
				<ul>{setlist_str}</ul>
				
			</div>
		</div>
	);
}