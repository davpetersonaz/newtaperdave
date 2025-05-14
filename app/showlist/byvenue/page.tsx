
//app/showlist/byvenue/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '../components/ShowList';
import { getShowListVenue } from '../../lib/database';
import ScrollToHash from '@/showlist/components/ScrollToHash';

export const metadata:Metadata = {
	title: 'List of Shows by Venue',
}

export default async function Page(){
	const output = await generateShowList(getShowListVenue, 'venue', 'getShowListVenue');
	return (
		<>
			<ScrollToHash />
			<div className='text-center pt-4'>
				{output}
			</div>
			<div className="relative">
				<Link href="/api/readshows" className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);
}