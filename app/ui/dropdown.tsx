//app/ui/dropdown.tsx
'use client';
import { useRef, useState } from 'react';

import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";

const ShowlistDropdown = () => {
	const [isOpen, setIsOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const openDropdown = () => {
		if (timeoutRef.current){ clearTimeout(timeoutRef.current); }
		setIsOpen(true);
	};
	const closeDropdown = () => {
		timeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, 200); // Small delay so you can move to the menu
	};

	return (
		<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
			<DropdownTrigger>
				<Button variant="solid" 
					className="rounded-md text-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 h-11 px-6 flex items-center justify-center"
					onMouseEnter={openDropdown}
					onMouseLeave={closeDropdown}
					onClick={() => {
						// Clicking the button goes to default view
						window.location.href = "/showlist/byyear";
					}}
				>
          			ShowList
				</Button>
			</DropdownTrigger>
			<DropdownMenu 
				aria-label="ShowList" 
				className="bg-gray-800 text-white min-w-[200px]"
				onMouseEnter={openDropdown}
				onMouseLeave={closeDropdown}
			>
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
};

export default ShowlistDropdown;