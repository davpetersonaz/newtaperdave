
import Image from 'next/image';
import Link from 'next/link';
import { getShow } from '@/app/lib/database';

export default async function Page({ params }: { params: { artist: string, showdate: string, source: string } }){
	console.warn('showinfo', params.artist, params.showdate, params.source);
	const showinfo = await getShow(decodeURIComponent(params.artist), params.showdate, params.source);
	console.warn('showinfo', showinfo);
	const artist_image = (showinfo.artist_square === '' 
			? (<p className='text-4xl font-bold'>{showinfo.artist}</p>) 
			: (<Image src={showinfo.artist_square} alt={showinfo.artist} height={showinfo.artist_square_h} width={showinfo.artist_square_w} className='mx-auto pb-4'/>) );
	const venue_image = (showinfo.venue_logo === '' 
			? (<p className='text-3xl font-bold pb-8'>{showinfo.venue}</p>)
			: (<Image src={showinfo.venue_logo} alt={showinfo.venue} height={showinfo.venue_logo_h} width={showinfo.venue_logo_w} className='mx-auto pt-4 pb-8'/>) );
	const pcloud_link = (showinfo.pcloudlink === '' 
			? <></>
			:(<Link href={showinfo.pcloudlink} className='pb-8'>Link to MP3 Download on pCloud</Link>));
	const sample = (showinfo.samplefile === ''
			?	<></>
			:	<>
					<div className='pt-8 border-3 border-black border-solid rounded'>
						<p>20-second sample</p>
						<audio controls className='w-300 h-54 m-0 mx-auto'>
							<source src={showinfo.samplefile.substring(8)} type='audio/mpeg' className='' />
						</audio>
					</div>
				</>);
	const setlist = JSON.parse(showinfo.setlist);
	let i = 1;//the key is not going to change, and we have nothing else to use to uniquely identify the line.
	const setlist_str = setlist.map(line => line === '' ? ( <br /> ) : ( <li key={i++}>{line === '' ? '  ' : line}</li> ) );
	return (
		<div className='text-center'> 
			<div className='grid grid-cols-2 gap-16'>
				<div className='text-center'>
					<div className='float-right pt-8'>
						{artist_image}
						<p>at</p>
						{venue_image}
						{pcloud_link}
						{sample}
					</div>
				</div>
				<div className='float-left'>
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