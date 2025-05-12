
// app/ui/spash-image.tsx*/
import Image from "next/image";

export default function SplashImage({ src }: { src: string }) {
    return (
        <div className="-ml-6 -mr-6">
            <Image src={src} alt="my mics through the years" width={2100} height={320} />
        </div>
    );
}