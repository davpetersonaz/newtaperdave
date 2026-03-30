//app/showlist/bysource/page.tsx
import { Metadata } from 'next';
import { generateShowList } from '../components/ShowList';
import ScrollToHash from '@/components/ScrollToHash';

export const dynamic = 'force-dynamic';

export const metadata:Metadata = {
	title: 'List of Shows by Source',
}

export default async function Page(){
	const output = await generateShowList('sourcetext', 'getShowListSource');
	return (
		<>
			<ScrollToHash />
			<div className='text-center pt-4'>
				{output}
			</div>
		</>
	);
}