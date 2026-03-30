//app/ui/skeletons.tsx
import Skeleton from "react-loading-skeleton";

import "react-loading-skeleton/dist/skeleton.css";

export default function FrequentBandSkeleton() {
	return (
		<div className="flex flex-row flex-wrap justify-around pb-8 gap-6">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="w-64">
					<Skeleton 
						height={160} 
						className="rounded-lg" 
					/>
					<Skeleton 
						height={20} 
						width="70%" 
						className="mt-3" 
					/>
				</div>
			))}
		</div>
	);
}
