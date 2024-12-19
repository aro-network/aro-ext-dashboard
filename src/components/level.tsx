import { cn } from "@nextui-org/react";

const Level0 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level0.png" alt="level0" />;
const Level1 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level1.png" alt="level1" />;
const Level2 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level2.png" alt="level2" />;
const Level3 = ({ className }: { className?: string }) => <img className={cn("w-[1em] h-[1em] object-contain", className)} src="/level3.png" alt="level3" />;

export const levels = [
  { icon: Level0, exp: 0, level: 0, name: "Baby Berry", boost: "+ 0%", boostNum: 1.0, color: "#DFDFDF" },
  { icon: Level1, exp: 100, level: 1, name: "Teen Berry", boost: "+ 50%", boostNum: 1.5, color: "#EAE0F0" },
  { icon: Level2, exp: 500, level: 2, name: "Big Blue", boost: "+ 100%", boostNum: 2.0, color: "#8A9CF1" },
  { icon: Level3, exp: 1000, level: 3, name: "Berry Captain", boost: "+ 200%", boostNum: 3.0, color: "#FFFBB4" },
];
