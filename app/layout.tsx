
import "./globals.css";
import { NavLinks } from './ui/nav-links';
import Header from './header';
import Footer from './footer';
import { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from './loading';
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

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
			<body className="flex flex-col min-h-screen text-gray-900 bg-gray-100">
				<Header />
				<NavLinks />
				<Suspense fallback={<Loading />}>
					<main className="mb-auto relative flex pb-20 flex-col mr-6 ml-6">{children}</main>
				</Suspense>
				<Footer />
			</body>
		</html>
	);
}
