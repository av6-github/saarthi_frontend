import Image, { StaticImageData } from "next/image";
import groundLevelOne from '@/assets/m-ground1.svg';
import groundLevelTwo from '@/assets/m-ground2.svg';

export default function BgImageLand() {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="relative w-full">
        <Image
          src={groundLevelOne as StaticImageData}
          alt="Piece of land on our memory lane scene"
          className="w-full h-auto relative z-10"
        />
        <Image
          src={groundLevelTwo as StaticImageData}
          alt="Piece of land with mountains on our memory lane scene"
          className="w-full h-auto absolute bottom-0 left-0 z-20"
        />
      </div>
    </div>
  );
}
