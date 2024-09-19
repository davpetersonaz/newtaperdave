
//import { FaGithub, FaTwitter } from 'react-icons/fa';

// Define the Footer component
export default function Footer(){
	return (
		<footer className="bg-gray-900 text-white py-4 z-50">
			{/* First section of the footer */}
			<div className="container mx-auto px-4 flex justify-between items-center">
				{/* Display your name and the current year */}
				<p className="mx-auto">Your Name &copy; {new Date().getFullYear()}</p>
			</div>
			{/* Second section of the footer */}
			<div className="container mx-auto px-4 flex justify-between items-center">
				{/* Provide a link to your Twitter profile */}
				<a href="https://twitter.com/your-username" className="mx-auto">
					Connect on Twitter
				</a>
			</div>
		</footer>
	);
}
