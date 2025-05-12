
//app/ui/skeletons.tsx
'use client';

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Loading animation
const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function FrequentBandSkeleton() {
	const bandSlots = 20;
	const skeletons = Array(bandSlots).fill(null).map((_, i) => (
		<div className="relative h-40 w-64 gap-4 mt-4" key={i}>
			<Skeleton height={160} />
		</div>
  ));
  return <>{skeletons}</>;
}
