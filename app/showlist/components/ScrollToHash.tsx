//app/showlist/components/ScrollToHash.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToHash() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';

    useEffect(() => {
        if (hash) {
            // Wait for the DOM to be fully rendered
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                // Get the top position of the target element
                const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
                // Apply an offset to account for the sticky header (64px header + 16px buffer)
                const offset = 72;
                window.scrollTo({
                    top: elementTop - offset,
                    behavior: 'smooth',
                });
            } else {
                // Retry after a short delay if the element isn't found
                const timeout = setTimeout(() => {
                    const retryElement = document.querySelector(hash);
                    if (retryElement) {
                        const elementTop = retryElement.getBoundingClientRect().top + window.scrollY;
                        const offset = 72; // Same offset for retry
                        window.scrollTo({
                            top: elementTop - offset,
                            behavior: 'smooth',
                        });
                    }
                }, 500); // Adjust delay as needed
                return () => clearTimeout(timeout);
            }
        }
    }, [hash, pathname, searchParams]); // Re-run if the route or hash changes

    return null;
}