//app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';

import { fetchSplashImage } from '@/lib/data';
import { getFeaturedBands } from '@/lib/database';
import FrequentBands from '@/ui/frequent-bands';
import FrequentBandSkeleton from '@/ui/skeletons';
import SplashImage from '@/ui/splash-image';

export default async function Page(){
	const splashImage = await fetchSplashImage();
	const bands = await getFeaturedBands();

	return (
		<div className="min-h-screen bg-white" suppressHydrationWarning>
			<div className="text-center pb-6">
				<h1 className="text-5xl font-bold tracking-tight text-gray-900">
					Shows I Have Taped
				</h1>
				<p className="text-xl text-gray-600 mt-2">
					Live audience recordings
				</p>
			</div>
			<SplashImage src={splashImage} />
			<div className="max-w-4xl mx-auto px-6 pt-10 pb-8">
				<p className="pb-4">
					<span className="font-bold">A quick note about taping live bands...</span>{' '}
					The bands I record are <span className="italic">&quot;taper-friendly&quot;</span>, they follow the tradition set forth by the Grateful Dead{' '}
					that <span className="italic">live audience recordings</span> are beneficial to the promotion and success of a touring band,{' '}
					especially those who throw a lot of improvisation into their sets{' '}
					(and therefore appreciate having their accomplishments preserved so they can relisten to what they brought forth).
				</p>
				<p className="pb-4">
					Having said that, <span className="font-bold">if you are with a band and I am inappropriately sharing your musical creations</span>,{' '}
					please <Link href="mailto:me@taperdave.com">email me right away</Link>.{' '}
					And I apologize and will not share those recordings in the future. <span className="italic">Sincerely.</span>
				</p>
				<p className="pb-4">
					Likewise, <span className="font-bold">if you are one of the creators and would like the original WAV files</span>,{' '}
					please <Link href="mailto:me@taperdave.com">email me</Link>{' '}
					and I will put the files on my website for you to download via a link I will email you.
				</p>
				<p className="pb-4">
					<span className="font-bold">I do not make money off these recordings</span>, there are no advertisements on this website,{' '}
					and I do not sell the recordings or their presence on this site in any way.{' '}
					<span className="italic">I will never sell any live recordings without direct positive agreement with and financial compensation to the artists.</span>
				</p>
				<p className="pb-4">
					I will eventually put everything on{' '}
					<Link href="https://archive.org/details/@taper-dave">The Internet Archive</Link>,{' '}
					however I will probably be somewhat selective on that so it will happen slowly (as I catch up with backlog).
				</p>
				<p className="pb-4">
					Keep in mind some recordings are better than others for a variety of reasons{' '}
					(the microphones, the placement, the room, me, the soundguy, the amps, etc).{' '}
					Generally, the older the recording, the higher the likelihood it might not be &quot;that great&quot;,{' '}
					I have provided samples of each show so you can take a quick listen before downloading.{' '}
					For your reference, the progression of equipment I have used started with the ZoomH4n, then the ZoomH6 for a brief period, then the ZoomH5,{' '}
					then I purchased some good external mics, first were Audio Technica 853 microphones, and most recently my new Golden Age Project FC4 condenser mics.
				</p>
				<p className="text-lg pb-4">
					<span className="italic">Download, listen, share with your friends!</span> and, most importantly,{' '}
					<span className="font-bold">GO SEE THESE BANDS WHEN THEY TOUR NEAR YOU!!</span>{' '}
					And, <span className="italic">buy their merchandise!</span>{' '}
					And buy their studio albums -- alot of these bands exhibit different sides of themselves in the studio vs on the road!{' '}
					They are great people and love to get down and have a good time,{' '}
					and a recording can only capture <span className="italic">one</span> aspect of a band&apos;s performance,{' '}
					so go experience the <span className="italic">whole thing</span> for yourself!!
				</p>
			</div>

			{/* Bottom section */}
			<div className="text-center mt-4 mb-12">
				<Link href="/showlist?s=y" className="text-3xl font-bold hover:underline text-blue-600">
						And On to The Music!
				</Link>
				<p className="text-2xl mt-3 text-gray-600 pb-4">here are some of the bands I have taped the most</p>
				<div className="flex flex-row flex-wrap justify-around pb-8">
					<Suspense fallback={<FrequentBandSkeleton />}>
						<FrequentBands bands={bands} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
