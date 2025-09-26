import Image, { StaticImageData } from "next/image";

interface ImageCardProps {
  date: string;
  src?: StaticImageData;
  className?: string;
}

export default function ImageCard({ date, src, className = "" }: ImageCardProps) {
  return (
    <div className={`bg-black/80 w-80 rounded-xl flex flex-col gap-4 p-5 ${className}`}>
      <div>
        <div className="bg-white h-40 relative rounded-md overflow-hidden">
          {src && (
            <Image
              src={src}
              alt="An image of memory"
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
      </div>
      <div className="font-inter text-[#ffffffc4] text-xl py-2">
        <p>{date}</p>
      </div>
    </div>
  );
}
