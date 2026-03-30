//app/showlist/byvenue/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '../components/ShowList';
import { getShowListVenue } from '../../lib/database';
import ScrollToHash from '@/components/ScrollToHash';
import AdminRegenerateButton from '@/components/AdminRegenerateButton';

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
			<div className="text-right mt-6">
				<AdminRegenerateButton />
			</div>
		</>
	);
}