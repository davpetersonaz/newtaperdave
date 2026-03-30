//app/showlist/byyear/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { generateShowList } from '@/showlist/components/ShowList';
import ScrollToHash from '@/components/ScrollToHash';
import AdminRegenerateButton from '@/components/AdminRegenerateButton';

export const dynamic = 'force-dynamic';

export const metadata:Metadata = {
	title: 'List of Shows by Year',
}

export default async function Page(){
	const output = await generateShowList('year', 'getShowListChrono');
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