
'use client';

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

const MyDropdown = () => {
	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" className="text-xl font-semibold bg-black text-white">ShowList</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="ShowList">
				<DropdownItem key="artist" href="/showlist" className="p-1 hover:bg-gray-500">Sort by Artist</DropdownItem>
				<DropdownItem key="year" href="/showlist/byyear" className="p-1 hover:bg-gray-500">Sort by Year</DropdownItem>
				<DropdownItem key="source" href="/showlist/bysource" className="p-1 hover:bg-gray-500">Sort by Source</DropdownItem>
				<DropdownItem key="venue" href="/showlist/byvenue" className="p-1 hover:bg-gray-500">Sort by Venue</DropdownItem>
				<DropdownItem key="city" href="/showlist/bycity" className="p-1 hover:bg-gray-500">Sort by City</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

export default MyDropdown;