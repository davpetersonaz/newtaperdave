//app/layout.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import Script from 'next/script';

import { config } from "@fortawesome/fontawesome-svg-core";

import { NavLinks } from './ui/nav-links';
import Footer from './footer';
import Header from './header';
import Loading from './loading';

import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

export const metadata: Metadata = {
	title: {
		template: '%s | TaperDave',
		default: 'TaperDave'
	},
	description: 'Live Recordings taped by Dave!',
	metadataBase: new URL('https://taperdave.com'),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en" className="bg-white">
			<body className="flex flex-col min-h-screen text-gray-900 bg-white">
				<Header />
				<NavLinks />
				<Suspense fallback={<Loading />}>
					<main className="mb-auto relative flex pb-20 flex-col mr-6 ml-6">
						{children}
					</main>
				</Suspense>
				<Footer />

				{/* Google Analytics */}
				<Script src={`https://www.googletagmanager.com/gtag/js?id=G-4DFMBQFFBB`} strategy="afterInteractive" />
				<Script id="google-analytics" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', 'G-4DFMBQFFBB');
				`}
				</Script>

				{/* Event Tracking */}
				<Script id="ga-events" strategy="afterInteractive">
				{`
					// Track specific important clicks
					function trackEvent(action, category, label) {
						gtag('event', action, {
						event_category: category,
						event_label: label,
						value: 1
						});
					}

					// Wait for DOM to load
					document.addEventListener('click', function(e) {
						const target = e.target.closest('a, button');
						if (!target){ return; }

						const text = target.innerText.trim() || target.getAttribute('aria-label') || 'unknown';

						// === Frequent Bands Logo Clicks ===
						if (target.closest('.frequent-band') || target.querySelector('img')) {
							trackEvent('frequent_band_click', 'engagement', text);
						}

						// ShowList dropdown items
						if (target.closest('[aria-label="ShowList"]')) {
							trackEvent('showlist_dropdown_click', 'navigation', text);
						}

						// "And On to The Music!" link
						if (text.includes('On to The Music') || target.href?.includes('/showlist')) {
							trackEvent('and_on_to_music_click', 'navigation', 'homepage');
						}

						// Download icons (zip, play, etc.)
						if (target.innerHTML.includes('faFileZipper') || 
							target.innerHTML.includes('faPlay') || 
							target.innerHTML.includes('faFileArrowDown')) {
								trackEvent('download_click', 'engagement', text);
						}

						// === Individual Show Page Visits ===
						if (target.href && target.href.includes('/showinfo/')) {
							trackEvent('show_page_view', 'content', target.href.split('/showinfo/')[1]);
						}

						// External links
						if (target.href && 
							(target.href.includes('archive.org') || 
							target.href.includes('mailto:') || 
							target.href.includes('x.com') || 
							target.href.includes('github.com'))) {
								trackEvent('external_link_click', 'outbound', target.href);
						}
					});
				`}
				</Script>
			</body>
		</html>
	);
}
