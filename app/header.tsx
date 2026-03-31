//app/header.tsx
import { ComponentType } from 'react';
import { FaGithub,FaTwitter } from 'react-icons/fa';
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
				{/* Social media icons */}
				{/*<div className="hidden md:block">
					<SocialIcons />
				</div> */}
			</div>
		</header>
	);
}

// Define the SocialIcons component
function SocialIcons() {
	const TwitterIcon = FaTwitter as ComponentType<{ className?: string }>;
	const GithubIcon = FaGithub as ComponentType<{ className?: string }>;
	return (
		<div className="flex gap-x-4">
			{/* Twitter icon */}
			<a href="https://x.com/Jordan_Thirkle" target="_blank" rel="noopener noreferrer" >
				<TwitterIcon className="text-white hover:text-gray-300" />
			</a>
			{/* GitHub icon */}
			<a href="https://github.com/jordan-thirkle" target="_blank" rel="noopener noreferrer" >
				<GithubIcon className="text-white hover:text-gray-300" />
			</a>
			{/* Add more social media icons as needed */}
		</div>
	);
}
