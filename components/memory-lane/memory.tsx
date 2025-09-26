import ImageCard from "./image-card";
import MemoryText from "./memory-text";
import { StaticImageData } from "next/image";

interface MemoryProps {
  id: number;
  src?: StaticImageData;
  memoryText: string;
  date: string;
}

export default function Memory({ id, src, memoryText, date }: MemoryProps) {
  return (
    <div className="flex gap-50 overflow-visible">
      {id % 2 !== 0 ? (
        <>
          <ImageCard date={date} src={src} className="-rotate-7 mt-6 ml-6" />
          <div className="w-[400px] h-auto flex justify-center items-center">
            <MemoryText memoryText={memoryText} />
          </div>
        </>
      ) : (
        <>
          <div className="w-[400px] h-auto flex justify-center items-center">
            <MemoryText memoryText={memoryText} />
          </div>
          <ImageCard date={date} src={src} className="rotate-7 mt-6 mr-6" />
        </>
      )}
    </div>
  );
}
