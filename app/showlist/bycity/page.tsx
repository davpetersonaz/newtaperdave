
//app/showlist/bycity/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { strip } from '../../lib/util';
import { generateShowList } from '../components/ShowList';
import { getShowListCity } from '../../lib/database';

export const metadata:Metadata = {
	title: 'List of Shows by City',
}

export default async function Page(){
	const output = await generateShowList(getShowListCity, 'city_state', 'getShowListCity');
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