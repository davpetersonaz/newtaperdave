
//app/showlist/bysource/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { strip } from '../../lib/util';
import { generateShowList } from '../components/ShowList';
import { getShowListSource } from '../../lib/database';

export const metadata:Metadata = {
	title: 'List of Shows by Source',
}

export default async function Page(){
	const output = await generateShowList(getShowListSource, 'sourcetext', 'getShowListSource');
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