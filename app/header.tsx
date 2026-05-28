//app/header.tsx
import Link from 'next/link';

import ShowlistDropdown from './ui/dropdown';

// Define the Header component
export default function Header(){
	return (
		<header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<div className="flex flex-row gap-x-6">
					<Link href="/"
						className="rounded-md text-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 h-11 px-6 flex items-center justify-center"
					>
						Taper Dave
					</Link>
					<ShowlistDropdown />
				</div>
			</div>
		</header>
	);
}
