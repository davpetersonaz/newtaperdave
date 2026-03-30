//app/showlist/byvenue/page.tsx
import { Metadata } from 'next';

import ScrollToHash from '@/components/ScrollToHash';

import { generateShowList } from '../components/ShowList';

export const dynamic = 'force-dynamic';

export const metadata:Metadata = {
	title: 'List of Shows by Venue',
}

export default async function Page(){
	const output = await generateShowList('venue', 'getShowListVenue');
	return (
		<>
			<ScrollToHash />
			<div className='text-center pt-4'>
				{output}
			</div>
		</>
	);
}