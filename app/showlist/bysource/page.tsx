
//app/showlist/bysource/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '../components/ShowList';
import { getShowListSource } from '../../lib/database';
import ScrollToHash from '@/showlist/components/ScrollToHash';

export const metadata:Metadata = {
	title: 'List of Shows by Source',
}

export default async function Page(){
	const output = await generateShowList(getShowListSource, 'sourcetext', 'getShowListSource');
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