//app/page.tsx
import SplashImage from '@/ui/splash-image';
import FrequentBands from '@/ui/frequent-bands';
import Link from 'next/link';
import { Suspense } from 'react'
import Loading from '@/loading';
import FrequentBandSkeleton from '@/ui/skeletons';
import { getFeaturedBands, checkConnection } from '@/lib/database';
import { fetchSplashImage } from '@/lib/data'; //import the fetch function

export default async function Page(){
	try{
		if (process.env.NODE_ENV === 'development') {
			await checkConnection();
		}
		const splashImage = await fetchSplashImage();// fetch image
		const bands = await getFeaturedBands(); //fetch bands
		const url = (process.env.ENVIRONMENT === 'VERCEL' ? 'https://taperdave.vercel.app' : 'http://localhost:3000');
		return (
			<div className="min-h-screen bg-gray-100">
				<SplashImage src={splashImage} /> {/* Pass data as a prop */}
				<div className="flex flex-col space-y-3 pt-6 mx-[20%]">
					<p>
						<span className="font-bold">A quick note about taping live bands...</span>{" "}
						The bands I record are <span className='italic'>&quot;taper-friendly&quot;</span>, they follow the tradition set forth by the Grateful Dead{" "}
						that <span className="italic">live audience recordings</span> are beneficial to the promotion and success of a touring band,{" "}
						especially those who throw a lot of improvisation into their sets{" "}
						(and therefore appreciate having their accomplishments preserved so they can relisten to what they brought forth).
					</p>
					<p>
						Having said that, <span className="font-bold">if you are with a band and I am inappropriately sharing your musical creations</span>,{" "}
						please <Link href="mailto:me@taperdave.com">email me right away</Link>.{" "}
						And I apologize and will not share those recordings in the future. <span className="italic">Sincerely.</span>
					</p>
					<p>
						Likewise, <span className="font-bold">if you are one of the creators and would like the original WAV files</span>,{" "}
						please <Link href="mailto:me@taperdave.com">email me</Link>{" "}
						and I will put the files on my website for you to download via a link I will email you.
					</p>
					<p>
						<span className="font-bold">I do not make money off these recordings</span>, there are no advertisements on this website,{" "}
						and I do not sell the recordings or their presence on this site in any way.{" "}
						<span className="italic">I will never sell any live recordings without direct positive agreement with and financial compensation to the artists.</span>
					</p>
					<p>
						I will eventually put everything on{" "}
						<Link href="https://archive.org/details/@taper-dave">The Internet Archive</Link>,{" "}
						however I'll probably be somewhat selective on that so it will happen slowly (as I catch up with backlog).
					</p>
					<p>
						Keep in mind some recordings are better than others for a variety of reasons{" "}
						(the microphones, the placement, the room, me, the soundguy, the amps, etc).{" "}
						Generally, the older the recording, the higher the likelihood it might not be &quot;that great&quot;,{" "}
						I have provided samples of each show so you can take a quick listen before downloading.{" "}
						For your reference, the progression of equipment I have used started with the ZoomH4n, then the ZoomH6 for a brief period, then the ZoomH5,{" "}
						then I purchased some good external mics, first were Audio Technica 853 microphones, and most recently my new Golden Age Project FC4 condenser mics.
					</p>
					<p className="text-lg">
						<span className="italic">Download, listen, share with your friends!</span> and, most importantly,{" "}
						<span className="font-bold">GO SEE THESE BANDS WHEN THEY TOUR NEAR YOU!!</span>{" "}
						And, <span className="italic">buy their merchandise!</span>{" "}
						And buy their studio albums -- alot of these bands exhibit different sides of themselves in the studio vs on the road!{" "}
						They are great people and love to get down and have a good time,{" "}
						and a recording can only capture <span className="italic">one</span> aspect of a band's performance,{" "}
						so go experience the <span className="italic">whole thing</span> for yourself!!
					</p>
				</div>
				<div className="text-center mt-8">
					<Link href="${url}/showlist?s=y"><span className="text-xl">And On to The Music!</span></Link>
					<p className="text-center">here are some of the bands I've taped the most</p>
					<div className="flex flex-row flex-wrap justify-around pb-8">
						<Suspense fallback={<FrequentBandSkeleton />}>
							<FrequentBands bands={bands} /> {/* pass bands as a prop */}
						</Suspense>
					</div>
				</div>
			</div>
		);
	}catch(error){
        return (
            <div>
                <h1>Error</h1>
                <p>Unable to connect to the database. Please try again later.</p>
            </div>
        );
	}
}
