//app/showlist/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '@/showlist/components/ShowList';
import { getShowListAlpha } from '@/lib/database';
import ScrollToHash from '@/showlist/components/ScrollToHash';

export const metadata:Metadata = {
	title: 'List of Shows by Artist',
}

export default async function Page(){
	const output = await generateShowList('artist', 'getShowListAlpha');
	return (
		<>
			<ScrollToHash />
			<div className='text-center pt-4'>
				{output}
			</div>
			<div className="relative">
				<Link href="/api/readshows" prefetch={false} className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);
}