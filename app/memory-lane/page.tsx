"use client";

import Sidebar from '@/components/homeui/sidebar';
import BgImageElements from '@/components/memory-lane/bg-image-elements';
import BgImageLand from '@/components/memory-lane/bg-image-land';
import Memory from '@/components/memory-lane/memory';
import { useState, useRef, useEffect } from 'react';

import memoryPic1 from '@/assets/memoryPic1.jpeg';
import memoryPic2 from '@/assets/memoryPic2.jpeg';
import memoryPic3 from '@/assets/memoryPic3.jpeg';
import memoryPic4 from '@/assets/memoryPic4.jpeg';
import memoryPic5 from '@/assets/memoryPic5.jpeg';
import memoryPic6 from '@/assets/memoryPic6.jpeg';

import { StaticImageData } from 'next/image';

interface MemoryItem {
  id: number;
  src: StaticImageData;
  memoryText: string;
  date: string;
}

const DUMMY_MEMORY: MemoryItem[] = [
  {
    id: 1,
    src: memoryPic1,
    memoryText: "The sun was slowly setting behind the hills, painting the sky in shades of orange and pink. I walked along the quiet path in the park, listening to the rustling of leaves and distant laughter of children. For a moment, I felt completely at peace, as if the world had paused just for me.",
    date: '21st November, 2025'
  },
  {
    id: 2,
    src: memoryPic2,
    memoryText: "I wandered into a tiny, old bookstore tucked away between two cafes. I ran my fingers along the spines of books I had never seen before and felt like I was stepping into a different world. I felt an overwhelming sense of nostalgia and wonder, remembering the countless afternoons I had spent lost in stories as a child.",
    date: '13th July, 2025'
  },
  {
    id: 3,
    src: memoryPic3,
    memoryText: "It started raining unexpectedly as I was walking home. The drops tapped rhythmically on my umbrella, and soon I found myself laughing as a few drops splashed on my cheeks. The streets glistened with reflections of the city lights, and the world felt alive in a completely new way. I slowed my pace, letting the rain soak in my thoughts, and experienced that rare, simple joy of being fully present in a moment.",
    date: '24th January, 2025'
  },
  {
    id: 4,
    src: memoryPic4,
    memoryText: "Today, I decided to cook a full meal for my family. The kitchen was filled with the aroma of spices and fresh ingredients. As everyone gathered around the table, their smiles warmed my heart in a way I hadn't felt in days. Seeing the joy in their faces made me realize how much these small, thoughtful acts can create lasting happiness and cherished memories.",
    date: '18th September, 2024'
  },
  {
    id: 5,
    src: memoryPic5,
    memoryText: "I took a spontaneous trip to the mountains today. The crisp air, the towering trees, and the distant sound of a waterfall felt like stepping into another world. I climbed to a small peak and sat there, letting the wind brush my face, taking in the breathtaking view. In that moment, all my worries felt insignificant, replaced by an overwhelming sense of gratitude for the beauty around me.",
    date: '5th March, 2024'
  },
  {
    id: 6,
    src: memoryPic6,
    memoryText: "A random encounter at the coffee shop turned into a heartwarming conversation. I met someone who shared stories of their travels and experiences that resonated deeply with me. For hours, we laughed, debated, and exchanged perspectives. As I walked away, I felt an unexpected connection, realizing that sometimes the most meaningful memories come from the smallest, unplanned moments.",
    date: '12th December, 2023'
  }
];

export default function MemoryLane() {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [timelineHeight, setTimelineHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setTimelineHeight(containerRef.current.scrollHeight);
    }
  }, [containerRef]);

  return (
    <div className="relative min-h-screen flex">
      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-memory-lane" />
          <BgImageElements />
          <BgImageLand />
        </div>

        <div
          ref={containerRef}
          className="h-screen overflow-y-auto scrollbar-hide relative py-20 flex flex-col items-center gap-20"
        >
          <div
            className="absolute left-1/2 w-3 bg-[#ffffffba] -translate-x-1/2 z-0 rounded-full"
            style={{ top: '40px', height: timelineHeight ? `${timelineHeight - 80}px` : '0' }}
          />

          {DUMMY_MEMORY.map((memory) => (
            <Memory
              key={memory.id}
              id={memory.id}
              date={memory.date}
              src={memory.src}
              memoryText={memory.memoryText}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
