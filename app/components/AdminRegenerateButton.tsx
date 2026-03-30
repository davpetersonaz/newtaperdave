import Link from 'next/link';

export default function AdminRegenerateButton() {
    const isAdmin = process.env.NEXT_PUBLIC_IS_ADMIN === 'true';
    if (!isAdmin) return null;

    return (
        <Link 
            href={`/api/readshows?secret=${process.env.RESET_SECRET}`}
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 underline"
        >
            🔧 Regenerate Shows (Admin Only)
        </Link>
    );
}