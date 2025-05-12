
//app/showlist/byyear/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { strip } from '@/lib/util';
import { generateShowList } from '@/showlist/components/ShowList';
import { getShowListAlpha } from '@/lib/database';

export const metadata:Metadata = {
	title: 'List of Shows by Artist',
}

export default async function Page(){
	const output = await generateShowList(getShowListAlpha, 'artist', 'getShowListAlpha');
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