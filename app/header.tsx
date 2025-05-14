//app/header.tsx
import Link from 'next/link';
import { FaTwitter, FaGithub } from 'react-icons/fa';
import MyDropdown from './ui/dropdown';
import { ComponentType } from 'react';

// Define the Header component
export default function Header(){
	return (
		<header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<div className="flex flex-row gap-x-6">
					<Link href="/" className="p-1.5 text-xl font-semibold">Taper Dave</Link>
					<MyDropdown />
				</div>
				{/* Navigation buttons
				<nav className="hidden md:block">
					<ul className="flex gap-x-6">
						<li><Link href="/" className="hover:text-gray-300">Home</Link></li>
						<li><Link href="/showlist" className="hover:text-gray-300">About</Link></li>
						<li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
					</ul>
				</nav>
				*/}
				{/* Social media icons */}
				<div className="hidden md:block">
					<SocialIcons />
				</div>
				{/* Add Mobile Navigation Toggle Here */}
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
