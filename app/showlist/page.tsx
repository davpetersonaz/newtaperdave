// app/showlist/page.tsx
import { Metadata } from 'next';
import { generateShowList } from '@/showlist/components/ShowList';
import ScrollToHash from '@/components/ScrollToHash';
import { regenerateShows } from '@/lib/regenerateShows';

export const metadata: Metadata = {
	title: 'List of Shows by Artist',
};

export default async function Page() {
	// Run regeneration during build (and on-demand in dev)
	if (process.env.NODE_ENV === 'production') {
		await regenerateShows();
	} else {
		// Optional: run in development too if you want
		// await regenerateShows();
	}

	const output = await generateShowList('artist', 'getShowListAlpha');
	return (
		<>
			<ScrollToHash />
			<div className='text-center pt-4'>
				{output}
			</div>
		</>
	);
}