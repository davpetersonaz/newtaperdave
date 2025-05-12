
'use client';

import { useCallback } from 'react';

export function ScrollToTopButton() {
	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	return (
		<button onClick={scrollToTop} className="fixed bottom-4 right-4">
			Scroll to Top
		</button>
	);
}