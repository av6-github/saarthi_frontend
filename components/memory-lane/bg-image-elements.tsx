"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";

import balloon1 from '@/assets/balloon1.svg';
import balloon2 from '@/assets/balloon2.svg';
import balloon3 from '@/assets/balloon3.svg';
import balloon4 from '@/assets/balloon4.svg';
import balloon5 from '@/assets/balloon5.svg';
import stars from '@/assets/stars.svg';
import sun from '@/assets/sun.svg';
import birds from '@/assets/birds.svg';

export default function BgImageElements() {
  return (
    <div className="relative w-full">
      <Image
        src={stars as StaticImageData}
        alt="Image of stars on our memory lane scene"
        className="w-full fixed top-0"
      />

      <motion.div
        className="fixed bottom-60 right-40"
        animate={{ y: [0, -55, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={balloon1 as StaticImageData} alt="Hot air balloon" className="h-40 w-40" />
      </motion.div>

      <motion.div
        className="fixed bottom-100 right-70"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={balloon2 as StaticImageData} alt="Hot air balloon" className="h-30 w-30" />
      </motion.div>

      <motion.div
        className="fixed bottom-100 left-60"
        animate={{ y: [0, -35, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={balloon3 as StaticImageData} alt="Hot air balloon" className="h-20 w-30" />
      </motion.div>

      <motion.div
        className="fixed bottom-70 left-100"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={balloon4 as StaticImageData} alt="Hot air balloon" className="h-20 w-30" />
      </motion.div>

      <motion.div
        className="fixed bottom-60 left-120"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={balloon5 as StaticImageData} alt="Hot air balloon" className="h-15 w-25" />
      </motion.div>

      <Image
        src={sun as StaticImageData}
        alt="Image of sun on our memory lane scene"
        className="h-36 w-36 fixed bottom-50 left-1/2 -translate-x-1/2"
      />

      <Image
        src={birds as StaticImageData}
        alt="Image of birds on our memory lane scene"
        className="h-36 w-36 fixed bottom-50 right-120 -translate-x-1/2"
      />
    </div>
  );
}
