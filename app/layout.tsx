
import "./globals.css";
import { NavLinks } from '@/app/ui/nav-links';
import Header from './header';
import Footer from './footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: {
		template: '%s | TaperDave',
		default: 'TaperDave'
	},
	description: 'Live Recordings taped by Dave!',
	metadataBase: new URL('https://taperdave.com'),
};
	
export default function RootLayout({
	children //this will be a page or a nested layout
}: Readonly<{ children: React.ReactNode; }>
) {
	return (
		<html lang="en">
			<body className="flex flex-col h-screen">
				<Header />
				<NavLinks />
				<main className="mb-auto relative flex min-h-screen flex-col mr-6 ml-6">{children}</main>
				<Footer />
			</body>
		</html>
	);
	
	//TODO: footer isn't staying on the bottom
}
