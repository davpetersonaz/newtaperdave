//app/header.tsx
import Image from 'next/image';
import Link from 'next/link';

import ShowlistDropdown from './ui/dropdown';

export default function Header(){
	return (
		<header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
			<div className="flex items-center justify-start gap-x-6 pl-6">
				<Link href="/" 
					className="font-serif text-4xl font-bold tracking-tighter italic hover:text-gray-300 transition-colors"
				>
					Taper Dave
				</Link>
				<Link href="/" className="flex items-center">
					<Image src="/images/taperdave.jpeg"
						alt="Taper Dave" width={52} height={52}
						className="rounded-full object-cover border-2 border-gray-700"
					/>
				</Link>
				<ShowlistDropdown />
			</div>
		</header>
	);
}
