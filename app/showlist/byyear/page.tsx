
//app/showlist/byyear/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '@/showlist/components/ShowList';
import { getShowListChrono } from '@/lib/database';

export const metadata:Metadata = {
	title: 'List of Shows by Year',
}

export default async function Page(){
	const output = await generateShowList(getShowListChrono, 'year', 'getShowListChrono');
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