
//import { FaGithub, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

// Define the Footer component
export default function Footer(){
	return (
		<footer className="bg-gray-900 text-white py-4 z-50 fixed left-0 bottom-0 right-0">
			{/* First section of the footer */}
			<div className="container mx-auto px-4 flex justify-between items-center">
				{/* Display your name and the current year */}
				<p className="mx-auto"><Link href='mailto:davpeterson@zoho.com' target='_blank'>Dave Peterson</Link> &copy; {new Date().getFullYear()}</p>
			</div>
			{/* Second section of the footer */}
			<div className="container mx-auto px-4 flex justify-between items-center">
				{/* Provide a link to your Twitter profile */}
				<Link href="https://twitter.com/davpeterson27" target='_blank' className="mx-auto">
					Connect on Twitter
				</Link>
			</div>
		</footer>
	);
}
