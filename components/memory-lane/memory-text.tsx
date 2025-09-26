interface MemoryTextProps {
  memoryText: string;
}

export default function MemoryText({ memoryText }: MemoryTextProps) {
  return (
    <div className="bg-black/50 w-sm rounded-xl flex flex-col gap-4 p-5 border-2 border-[#ffffff3f] font-inter">
      <div className="font-inter text-[#ffffffc4] text-sm py-2">
        <p>{memoryText}</p>
      </div>
    </div>
  );
}
