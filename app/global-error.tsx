//app/global-error.tsx
'use client' // Error boundaries must be Client Components

export default function GlobalError({ error, reset }: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html>
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="text-center p-8">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							Something went wrong!
						</h2>
						<p className="text-gray-600 mb-6">
							{error.message || 'An unexpected error occurred'}
						</p>
						{error.digest && (
							<p className="text-xs text-gray-400 mb-6">Error ID: {error.digest}</p>
						)}
						<button
							onClick={() => reset()}
							className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							Try again
						</button>
					</div>
				</div>
			</body>
		</html>
	)
}
