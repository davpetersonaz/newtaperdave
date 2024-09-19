
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'List of Shows',
};

export default function Page(){
	return (
		<>
			<h2 className="text-center">Shows I Have Taped</h2>
			<div className="relative">
				<Link href="" className="float-right">Up to Top</Link>
			</div>
			<div className="relative">
				<Link href="/api/readshows" className="float-right">Regenerate Shows</Link>
			</div>
		</>
	);
}