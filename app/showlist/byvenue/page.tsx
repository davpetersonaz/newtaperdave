
//app/showlist/byvenue/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { strip } from '../../lib/util';
import { generateShowList } from '../components/ShowList';
import { getShowListVenue } from '../../lib/database';

export const metadata:Metadata = {
	title: 'List of Shows by Venue',
}

export default async function Page(){
	const output = await generateShowList(getShowListVenue, 'venue', 'getShowListVenue');
	return (
		<>
			<div className='text-center'>
				{output}
			</div>
			<div className="relative">
				<Link href="/api/readshows" className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);
}