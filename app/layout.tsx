
import localFont from "next/font/local";
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
	
const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900"
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900"
});

export default function RootLayout({
	children //this will be a page or a nested layout
}: Readonly<{ children: React.ReactNode; }>
) {
	return (
		<html lang="en">
			<body className="flex flex-col h-screen">
				<Header />
				<NavLinks />
				<main className="mb-auto">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
//formerly was: 
//<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
