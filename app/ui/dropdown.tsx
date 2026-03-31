//app/ui/dropdown.tsx
'use client';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import Link from 'next/link';

const ShowlistDropdown = () => {
	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="solid" 
					className="rounded-md text-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 h-11 px-6 flex items-center justify-center"
				>
					<Link href="/showlist/byyear" className="block w-full h-full flex items-center justify-center">ShowList</Link>
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="ShowList" className="bg-gray-800 text-white min-w-[200px]">
				<DropdownItem key="artist" href="/showlist" className="hover:bg-gray-700">
					Sort by Artist
				</DropdownItem>
				<DropdownItem key="year" href="/showlist/byyear" className="hover:bg-gray-700">
					Sort by Year
				</DropdownItem>
				<DropdownItem key="source" href="/showlist/bysource" className="hover:bg-gray-700">
					Sort by Source
				</DropdownItem>
				<DropdownItem key="venue" href="/showlist/byvenue" className="hover:bg-gray-700">
					Sort by Venue
				</DropdownItem>
				<DropdownItem key="city" href="/showlist/bycity" className="hover:bg-gray-700">
					Sort by City
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

export default ShowlistDropdown;