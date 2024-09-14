
'use client';
 
import { usePathname } from 'next/navigation';
import Link from 'next/link';
 
export function NavLinks(){
	const pathname = usePathname();
//	console.info('pathname', pathname);
	return (
		<nav className='p-6'>
			<Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
				<span className='underline'>Home</span>
			</Link>
			&nbsp;|&nbsp;
			<Link className={`link ${pathname === '/showlist' ? 'active' : ''}`} href="/showlist">
				<span className='underline'>Shows List</span>
			</Link>
		</nav>
	)
}
